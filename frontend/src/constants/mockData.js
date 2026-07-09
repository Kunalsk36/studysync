/**
 * Realistic sample data for the visual prototype only.
 * No API calls, no persistence — every page reads from here.
 */

export const CURRENT_USER = {
  name: "Kunal Kavathekar",
  email: "kunal@example.com",
  avatarInitials: "KK",
  userType: "student",
  dailyGoalHours: 4,
  weeklyGoalHours: 28,
  studyStreak: 7,
  theme: "dark",
};

export const TASKS = [
  {
    id: 1,
    title: "Complete React Course",
    category: "React",
    color: "#3B82F6",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-07-12",
    estimatedMinutes: 180,
    actualMinutes: 95,
    tags: ["react", "frontend"],
    subtasks: [
      { id: 1, title: "Hooks deep dive", done: true },
      { id: 2, title: "Server components", done: false },
    ],
  },
  {
    id: 2,
    title: "Revise DSA Arrays",
    category: "DSA",
    color: "#F59E0B",
    priority: "high",
    status: "pending",
    dueDate: "2026-07-09",
    estimatedMinutes: 90,
    actualMinutes: 0,
    tags: ["dsa", "revision"],
    subtasks: [
      { id: 1, title: "Two-pointer problems", done: false },
      { id: 2, title: "Sliding window set", done: false },
    ],
  },
  {
    id: 3,
    title: "Practice Aptitude",
    category: "Placement Prep",
    color: "#22C55E",
    priority: "medium",
    status: "pending",
    dueDate: "2026-07-10",
    estimatedMinutes: 60,
    actualMinutes: 0,
    tags: ["aptitude"],
    subtasks: [],
  },
  {
    id: 4,
    title: "Build Portfolio Project (StudySync)",
    category: "Personal",
    color: "#6366F1",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-07-20",
    estimatedMinutes: 600,
    actualMinutes: 240,
    tags: ["project"],
    subtasks: [
      { id: 1, title: "Frontend prototype", done: true },
      { id: 2, title: "Backend API", done: false },
    ],
  },
  {
    id: 5,
    title: "Mock Technical Interview",
    category: "Interview Prep",
    color: "#EF4444",
    priority: "high",
    status: "pending",
    dueDate: "2026-07-14",
    estimatedMinutes: 60,
    actualMinutes: 0,
    tags: ["interview"],
    subtasks: [],
  },
  {
    id: 6,
    title: "Read Java Streams Chapter",
    category: "Java",
    color: "#F97316",
    priority: "low",
    status: "completed",
    dueDate: "2026-07-07",
    estimatedMinutes: 45,
    actualMinutes: 40,
    tags: ["java"],
    subtasks: [],
  },
  {
    id: 7,
    title: "Update Resume",
    category: "Placement Prep",
    color: "#22C55E",
    priority: "medium",
    status: "completed",
    dueDate: "2026-07-05",
    estimatedMinutes: 30,
    actualMinutes: 35,
    tags: ["career"],
    subtasks: [],
  },
];

export const TASK_CATEGORIES = [
  { id: 1, name: "React", color: "#3B82F6" },
  { id: 2, name: "DSA", color: "#F59E0B" },
  { id: 3, name: "Placement Prep", color: "#22C55E" },
  { id: 4, name: "Personal", color: "#6366F1", isDefault: true },
  { id: 5, name: "Interview Prep", color: "#EF4444" },
  { id: 6, name: "Java", color: "#F97316" },
];

export const CALENDAR_EVENTS = [
  { id: 1, title: "MCA Viva", type: "exam", date: "2026-07-11", time: "10:00 AM" },
  { id: 2, title: "Technical Interview", type: "interview", date: "2026-07-14", time: "2:00 PM" },
  { id: 3, title: "Java Revision", type: "study", date: "2026-07-09", time: "6:00 PM" },
  { id: 4, title: "Mentor Sync", type: "meeting", date: "2026-07-15", time: "11:30 AM" },
  { id: 5, title: "React Course Deadline", type: "deadline", date: "2026-07-12", time: "11:59 PM" },
  { id: 6, title: "Weekend Trip", type: "personal", date: "2026-07-19", time: "All day" },
];

export const EVENT_TYPE_STYLES = {
  exam: { label: "Exam", color: "#EF4444" },
  interview: { label: "Interview", color: "#6366F1" },
  study: { label: "Study", color: "#3B82F6" },
  meeting: { label: "Meeting", color: "#F59E0B" },
  deadline: { label: "Deadline", color: "#F97316" },
  personal: { label: "Personal", color: "#22C55E" },
};

export const POMODORO_HISTORY = [
  { id: 1, type: "focus", minutes: 25, task: "Complete React Course", date: "Today, 9:10 AM" },
  { id: 2, type: "focus", minutes: 25, task: "Complete React Course", date: "Today, 9:40 AM" },
  { id: 3, type: "short_break", minutes: 5, task: null, date: "Today, 10:05 AM" },
  { id: 4, type: "focus", minutes: 25, task: "Revise DSA Arrays", date: "Yesterday, 7:00 PM" },
  { id: 5, type: "focus", minutes: 25, task: "Java Streams", date: "Yesterday, 8:00 PM" },
];

export const STUDY_GOALS = [
  {
    id: 1,
    title: "Complete React Full Course",
    description: "Finish all modules, hooks, and a capstone project.",
    targetHours: 40,
    completedHours: 22,
    targetDate: "2026-08-01",
    status: "active",
  },
  {
    id: 2,
    title: "Master DSA Fundamentals",
    description: "Arrays, strings, trees, graphs — with 150 practice problems.",
    targetHours: 60,
    completedHours: 18,
    targetDate: "2026-09-15",
    status: "active",
  },
  {
    id: 3,
    title: "Placement Readiness",
    description: "Aptitude, resume, and mock interviews before campus drives.",
    targetHours: 30,
    completedHours: 30,
    targetDate: "2026-07-01",
    status: "completed",
  },
];

export const ANALYTICS = {
  studyStreak: 7,
  longestStreak: 14,
  studyHoursToday: 2.5,
  dailyGoalHours: 4,
  weeklyGoalHours: 28,
  weeklyCompletedHours: 19.5,
  completedTasks: 42,
  missedTasks: 5,
  averageStudyTimeMinutes: 145,
  completionPercentage: 78,
  weekly: [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4 },
    { day: "Wed", hours: 2 },
    { day: "Thu", hours: 4.5 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 3 },
    { day: "Sun", hours: 2.5 },
  ],
  monthly: [
    { week: "Week 1", hours: 18 },
    { week: "Week 2", hours: 22 },
    { week: "Week 3", hours: 15 },
    { week: "Week 4", hours: 19.5 },
  ],
};

export const NOTIFICATIONS = [
  {
    id: 1,
    type: "task",
    title: "Pomodoro Complete",
    message: "Great focus! You completed a 25-minute session on Complete React Course.",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    type: "calendar",
    title: "Interview Tomorrow",
    message: "Your Technical Interview is scheduled for tomorrow at 2:00 PM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "achievement",
    title: "Goal Achieved",
    message: "You reached your daily study goal of 4 hours. Keep it up!",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "goal",
    title: "Weekly Goal Reminder",
    message: "You're 8.5 hours away from your weekly goal of 28 hours.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "task",
    title: "Task Reminder",
    message: "\"Revise DSA Arrays\" is due tomorrow.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "system",
    title: "Welcome to StudySync",
    message: "Your workspace is ready. Start by creating your first task.",
    time: "3 days ago",
    read: true,
  },
];

export const ACHIEVEMENTS = [
  {
    id: 1,
    title: "7 Day Streak",
    description: "Maintain a study streak for seven consecutive days.",
    icon: "Flame",
    color: "#F59E0B",
    earned: true,
    earnedAt: "2026-07-06",
  },
  {
    id: 2,
    title: "First 100 Tasks",
    description: "Complete 100 tasks across all categories.",
    icon: "ListChecks",
    color: "#22C55E",
    earned: true,
    earnedAt: "2026-06-28",
  },
  {
    id: 3,
    title: "Goal Crusher",
    description: "Hit your weekly study goal three weeks in a row.",
    icon: "Trophy",
    color: "#6366F1",
    earned: true,
    earnedAt: "2026-07-01",
  },
  {
    id: 4,
    title: "Early Riser",
    description: "Complete a focus session before 7 AM, five times.",
    icon: "Sunrise",
    color: "#F97316",
    earned: false,
  },
  {
    id: 5,
    title: "100 Study Hours",
    description: "Accumulate 100 hours of total study time.",
    icon: "Clock",
    color: "#3B82F6",
    earned: false,
  },
  {
    id: 6,
    title: "30 Day Streak",
    description: "Maintain a study streak for thirty consecutive days.",
    icon: "Flame",
    color: "#EF4444",
    earned: false,
  },
];

export const AI_HISTORY = [
  {
    id: 1,
    prompt: "Create a study schedule for Java and React this week.",
    response:
      "Here's a balanced plan:\n\nMon: Java Streams (1.5h) • React Hooks (1h)\nTue: DSA Arrays (1h) • React Components (1.5h)\nWed: Java Collections (1.5h) • Rest\nThu: React Project (2h)\nFri: Mock Interview Prep (1h) • React Testing (1h)\n\nI've weighted React slightly higher since your course deadline is closer.",
    createdAt: "Today, 8:02 AM",
  },
  {
    id: 2,
    prompt: "How long will it take to finish the React Course task?",
    response:
      "Based on your average pace (about 45 minutes per module) and 6 modules remaining, I'd estimate roughly 4.5 hours of focused work — about 2 more Pomodoro sessions per day over 3 days.",
    createdAt: "Yesterday, 6:45 PM",
  },
];

export const SUGGESTED_AI_PROMPTS = [
  "Plan my study schedule for this week",
  "Estimate time needed for DSA Arrays revision",
  "Suggest how to balance React Course and interview prep",
  "What should I focus on today?",
];
