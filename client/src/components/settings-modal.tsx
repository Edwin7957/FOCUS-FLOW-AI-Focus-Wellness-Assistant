import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Eye, Zap } from "lucide-react";
import { mockDetectionService } from "@/lib/mock-detection";
import type { FocusState } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [detectionSensitivity, setDetectionSensitivity] = useState([80]);
  const [nudgeFrequency, setNudgeFrequency] = useState("normal");

  const handleTestDetection = (state: FocusState) => {
    mockDetectionService.triggerState(state);
  };

  const handleResetSession = () => {
    mockDetectionService.resetSession();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-medium">Notifications</Label>
            </div>
            <div className="flex items-center justify-between pl-8">
              <Label htmlFor="notifications" className="text-sm text-gray-600">
                Enable focus nudges
              </Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>

          {/* Detection Sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-medium">Detection Sensitivity</Label>
            </div>
            <div className="pl-8 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Sensitivity</Label>
                <span className="text-sm font-medium">{detectionSensitivity[0]}%</span>
              </div>
              <Slider
                value={detectionSensitivity}
                onValueChange={setDetectionSensitivity}
                max={100}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Nudge Frequency */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-medium">Nudge Frequency</Label>
            </div>
            <div className="pl-8">
              <Select value={nudgeFrequency} onValueChange={setNudgeFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Every 2 minutes)</SelectItem>
                  <SelectItem value="normal">Normal (Every minute)</SelectItem>
                  <SelectItem value="high">High (Every 30 seconds)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Label className="text-base font-medium">Test Detection (Development)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => handleTestDetection("FOCUSED")}
              >
                Focused
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                onClick={() => handleTestDetection("DROWSY")}
              >
                Drowsy
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleTestDetection("DISTRACTED")}
              >
                Distracted
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={() => handleTestDetection("STRESSED")}
              >
                Stressed
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="w-full text-gray-600"
              onClick={handleResetSession}
            >
              Reset Session Timer
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}