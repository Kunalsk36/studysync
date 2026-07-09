import { Trophy, Flame } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { ACHIEVEMENTS, ANALYTICS } from "@/constants/mockData";

export default function AchievementsPage() {
  const earnedCount = ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Milestones that reward consistency, not competition."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Trophy}
          label="Badges Earned"
          value={`${earnedCount} / ${ACHIEVEMENTS.length}`}
          tone="primary"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${ANALYTICS.studyStreak} days`}
          tone="warning"
        />
        <StatCard
          icon={Flame}
          label="Longest Streak"
          value={`${ANALYTICS.longestStreak} days`}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
