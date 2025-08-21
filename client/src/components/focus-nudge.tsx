import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertTriangle, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FocusState } from "../types";

interface FocusNudgeProps {
  state: FocusState | null;
  onDismiss: () => void;
}

const nudgeConfig = {
  FOCUSED: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-500",
    title: "Great Focus!",
    message: "You've been focused for several minutes. Keep it up!",
  },
  DROWSY: {
    icon: Coffee,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    title: "Take a Break",
    message: "Looks like you need a 5-minute break to recharge.",
  },
  DISTRACTED: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-500",
    title: "Stay Focused",
    message: "Eyes back on the prize! You can do this.",
  },
  STRESSED: {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    title: "Relax",
    message: "Take a deep breath and try to relax your shoulders.",
  },
};

export function FocusNudge({ state, onDismiss }: FocusNudgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNudge, setCurrentNudge] = useState<FocusState | null>(null);

  useEffect(() => {
    if (state && state !== currentNudge) {
      setCurrentNudge(state);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentNudge(null), 300); // Wait for animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state, currentNudge]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentNudge(null);
      onDismiss();
    }, 300);
  };

  if (!currentNudge) return null;

  const config = nudgeConfig[currentNudge];
  const IconComponent = config.icon;

  return (
    <div className={cn(
      "fixed top-6 right-6 max-w-sm transform transition-all duration-300 ease-in-out z-50",
      isVisible ? "translate-x-0" : "translate-x-full"
    )}>
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", config.bgColor)}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">{config.title}</h4>
              <p className="text-sm text-gray-600">{config.message}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 text-gray-400 hover:text-gray-600 flex-shrink-0"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
