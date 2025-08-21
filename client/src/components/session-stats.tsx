import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { SessionStats } from "../types";

interface SessionStatsProps {
  stats: SessionStats;
  formatTime: (seconds: number) => string;
}

export function SessionStats({ stats, formatTime }: SessionStatsProps) {
  const achievements = [];
  
  if (stats.focusedTime >= 1200) { // 20+ minutes
    achievements.push({
      icon: Trophy,
      text: "20+ min focused session",
      color: "text-yellow-500",
    });
  }
  
  if (stats.focusScore >= 85) {
    achievements.push({
      icon: Target,
      text: "85%+ focus score",
      color: "text-blue-500",
    });
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Session Stats
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {/* Focus Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Focus Score</span>
              <span className="text-lg font-bold text-green-600">
                {stats.focusScore}%
              </span>
            </div>
            <Progress value={stats.focusScore} className="h-2" />
          </div>
          
          {/* Time Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {formatTime(stats.focusedTime)}
              </div>
              <div className="text-xs text-gray-500">Focused</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">
                {formatTime(stats.drowsyTime)}
              </div>
              <div className="text-xs text-gray-500">Drowsy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {formatTime(stats.distractedTime)}
              </div>
              <div className="text-xs text-gray-500">Distracted</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">
                {formatTime(stats.stressedTime)}
              </div>
              <div className="text-xs text-gray-500">Stressed</div>
            </div>
          </div>
          
          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Today's Achievements
              </h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <IconComponent className={`w-4 h-4 ${achievement.color}`} />
                      <span>{achievement.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {achievements.length === 0 && (
            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Keep studying to unlock achievements!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
