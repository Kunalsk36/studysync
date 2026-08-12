const { pool } = require("../database/connection");
const notificationService = require("../services/notification.service");
const logger = require("../utils/logger");

async function runNotificationJob() {
  logger.info("[Scheduler] Notification job started");
  let notificationsCreated = 0;

  try {
    // 1. Get users with notifications enabled
    const [users] = await pool.query(
      "SELECT user_id FROM user_preferences WHERE notifications_enabled = 1"
    );

    if (users.length === 0) {
      logger.info("[Scheduler] Notification job completed (No eligible users)");
      return;
    }

    const userIds = users.map((u) => u.user_id);

    // 2. Process Task Reminders
    // Status should be pending or in_progress
    const [tasks] = await pool.query(
      `SELECT id, user_id, title, due_date,
        TIMESTAMPDIFF(MINUTE, NOW(), due_date) as diff_minutes
       FROM tasks
       WHERE user_id IN (?)
         AND status IN ('pending', 'in_progress')
         AND due_date IS NOT NULL
         AND (
           (TIMESTAMPDIFF(MINUTE, NOW(), due_date) BETWEEN 1430 AND 1450) OR
           (TIMESTAMPDIFF(MINUTE, NOW(), due_date) BETWEEN 50 AND 70)
         )`,
      [userIds]
    );

    for (const task of tasks) {
      try {
        const is24h = task.diff_minutes >= 1430;
        const windowLabel = is24h ? "24h" : "1h";
        const hoursLabel = is24h ? "24 hours" : "1 hour";
        
        await notificationService.createNotification({
          userId: task.user_id,
          title: `Task Reminder: ${task.title}`,
          message: `Your task "${task.title}" is due in ${hoursLabel}.`,
          notificationType: "task",
          dedupeKey: `task_${task.id}_due_${windowLabel}`,
        }).then(res => {
          if (res) notificationsCreated++;
        });
      } catch (err) {
        logger.error(`[Scheduler] Failed to process task ${task.id}:`, err);
      }
    }

    // 3. Process Upcoming Exam Reminders
    const [exams] = await pool.query(
      `SELECT id, user_id, title, start_datetime,
        TIMESTAMPDIFF(MINUTE, NOW(), start_datetime) as diff_minutes
       FROM calendar_events
       WHERE user_id IN (?)
         AND event_type = 'exam'
         AND start_datetime IS NOT NULL
         AND (
           (TIMESTAMPDIFF(MINUTE, NOW(), start_datetime) BETWEEN 1430 AND 1450) OR
           (TIMESTAMPDIFF(MINUTE, NOW(), start_datetime) BETWEEN 50 AND 70)
         )`,
      [userIds]
    );

    for (const exam of exams) {
      try {
        const is24h = exam.diff_minutes >= 1430;
        const windowLabel = is24h ? "24h" : "1h";
        const hoursLabel = is24h ? "24 hours" : "1 hour";
        
        await notificationService.createNotification({
          userId: exam.user_id,
          title: `Exam Reminder: ${exam.title}`,
          message: `Your exam "${exam.title}" is scheduled in ${hoursLabel}.`,
          notificationType: "calendar",
          dedupeKey: `calendar_${exam.id}_exam_${windowLabel}`,
        }).then(res => {
          if (res) notificationsCreated++;
        });
      } catch (err) {
        logger.error(`[Scheduler] Failed to process exam ${exam.id}:`, err);
      }
    }

    // 4. Process Daily Study/Goal Reminders (9:00 AM)
    // Check if current hour is 9 AM (server timezone limitation)
    const currentHour = new Date().getHours();
    if (currentHour === 9) {
      const todayDate = new Date().toISOString().split('T')[0];
      
      const [goals] = await pool.query(
        `SELECT id, user_id 
         FROM study_goals 
         WHERE user_id IN (?) AND status = 'active'`,
        [userIds]
      );

      for (const goal of goals) {
        try {
          await notificationService.createNotification({
            userId: goal.user_id,
            title: `Study Goal Reminder`,
            message: `Remember to make progress toward your study goals today.`,
            notificationType: "goal",
            dedupeKey: `goal_${goal.id}_daily_${todayDate}`,
          }).then(res => {
            if (res) notificationsCreated++;
          });
        } catch (err) {
          logger.error(`[Scheduler] Failed to process goal ${goal.id}:`, err);
        }
      }
    }

  } catch (error) {
    logger.error("[Scheduler] Unexpected error in notification job:", error);
  } finally {
    logger.info(`[Scheduler] Notification job completed. Created ${notificationsCreated} notifications.`);
  }
}

module.exports = {
  runNotificationJob,
};
