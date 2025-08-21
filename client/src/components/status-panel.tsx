import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Bed, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FocusState } from "../types";

interface StatusPanelProps {
  currentState: FocusState;
  confidence?: number;
}

const stateConfig = {
  FOCUSED: {
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-500",
    lightBg: "bg-green-50",
    borderColor: "border-green-200",
    message: "Great job! Keep it up",
  },
  DROWSY: {
    icon: Bed,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    lightBg: "bg-yellow-50",
    borderColor: "border-yellow-200",
    message: "Looks like you need a break",
  },
  DISTRACTED: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-500",
    lightBg: "bg-red-50",
    borderColor: "border-red-200",
    message: "Eyes back on the prize!",
  },
  STRESSED: {
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    message: "Take a deep breath",
  },
};

export function StatusPanel({ currentState, confidence = 0 }: StatusPanelProps) {
  const config = stateConfig[currentState];
  const IconComponent = config.icon;

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Current Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        {/* Main Status */}
        <div className="text-center mb-6">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3", config.bgColor)}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h3 className={cn("text-2xl font-bold mb-1", config.color)}>
            {currentState}
          </h3>
          <p className="text-gray-600">{config.message}</p>
          {confidence > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          )}
        </div>
        
        {/* Status Indicators */}
        <div className="space-y-3">
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            currentState === "FOCUSED" ? `${config.lightBg} ${config.borderColor}` : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center space-x-3">
              <Eye className={cn("w-4 h-4", currentState === "FOCUSED" ? config.color : "text-gray-400")} />
              <span className="text-sm font-medium text-gray-900">Attention</span>
            </div>
            <span className={cn(
              "text-sm font-semibold",
              currentState === "FOCUSED" ? config.color : "text-gray-500"
            )}>
              {currentState === "FOCUSED" ? "Active" : "None"}
            </span>
          </div>
          
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            currentState === "DROWSY" ? `${config.lightBg} ${config.borderColor}` : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center space-x-3">
              <Bed className={cn("w-4 h-4", currentState === "DROWSY" ? config.color : "text-gray-400")} />
              <span className="text-sm font-medium text-gray-900">Drowsiness</span>
            </div>
            <span className={cn(
              "text-sm font-semibold",
              currentState === "DROWSY" ? config.color : "text-gray-500"
            )}>
              {currentState === "DROWSY" ? "Detected" : "None"}
            </span>
          </div>
          
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            currentState === "STRESSED" ? `${config.lightBg} ${config.borderColor}` : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center space-x-3">
              <Zap className={cn("w-4 h-4", currentState === "STRESSED" ? config.color : "text-gray-400")} />
              <span className="text-sm font-medium text-gray-900">Stress Level</span>
            </div>
            <span className={cn(
              "text-sm font-semibold",
              currentState === "STRESSED" ? config.color : "text-gray-500"
            )}>
              {currentState === "STRESSED" ? "High" : "Low"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
