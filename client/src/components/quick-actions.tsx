import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Coffee, Square } from "lucide-react";

interface QuickActionsProps {
  onPauseSession: () => void;
  onTakeBreak: () => void;
  onEndSession: () => void;
}

export function QuickActions({ onPauseSession, onTakeBreak, onEndSession }: QuickActionsProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-3">
          <Button
            className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
            variant="ghost"
            onClick={onPauseSession}
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause Session
          </Button>
          
          <Button
            className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
            variant="ghost"
            onClick={onTakeBreak}
          >
            <Coffee className="w-4 h-4 mr-2" />
            Take a Break
          </Button>
          
          <Button
            className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
            variant="ghost"
            onClick={onEndSession}
          >
            <Square className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
