import { useState, useEffect } from "react";
import { Brain, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CameraFeed } from "@/components/camera-feed";
import { StatusPanel } from "@/components/status-panel";
import { FocusChart } from "@/components/focus-chart";
import { SessionStats } from "@/components/session-stats";
import { QuickActions } from "@/components/quick-actions";
import { FocusNudge } from "@/components/focus-nudge";
import { PrivacyConsent } from "@/components/privacy-consent";
import { SettingsModal } from "@/components/settings-modal";
import { useSession } from "@/hooks/use-session";
import type { DetectionResult, FocusState } from "../types";

export default function Dashboard() {
  const { toast } = useToast();
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [sessionTimer, setSessionTimer] = useState("00:00:00");
  const [nudgeState, setNudgeState] = useState<FocusState | null>(null);
  const [lastDetection, setLastDetection] = useState<DetectionResult | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const {
    session,
    events,
    currentState,
    startSession,
    endSession,
    updateState,
    calculateStats,
    formatTime,
    getSessionTimer,
    isCreatingSession,
  } = useSession();

  // Update session timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimer(getSessionTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [getSessionTimer]);

  // Handle detection results
  const handleDetection = async (result: DetectionResult) => {
    if (isPaused) return; // Don't process detection when paused
    
    setLastDetection(result);
    
    if (result.state !== currentState) {
      await updateState(result.state, result.confidence);
      
      // Show nudge for non-focused states
      if (result.state !== "FOCUSED") {
        setNudgeState(result.state);
      }
    }
  };

  const handleConsentAccept = async () => {
    setHasConsent(true);
    setShowConsentModal(false);
    
    // Start a new session
    await startSession();
    
    toast({
      title: "Session Started",
      description: "Your study session has begun. Stay focused!",
    });
  };

  const handleConsentDecline = () => {
    toast({
      title: "Camera Access Required",
      description: "Camera access is required for the Smart Study Companion to work.",
      variant: "destructive",
    });
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Session Resumed" : "Session Paused",
      description: isPaused ? "Detection has resumed." : "Detection is paused. Click again to resume.",
    });
  };

  const handleTakeBreak = () => {
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
      toast({
        title: "Break Over!",
        description: "Detection has resumed. Welcome back!",
      });
    }, 5000); // 5 second break
    
    toast({
      title: "Break Time!",
      description: "Taking a 5-second break. Detection will resume automatically.",
    });
  };

  const handleEndSession = async () => {
    await endSession();
    toast({
      title: "Session Ended",
      description: "Great job studying! Check your stats below.",
    });
  };

  const stats = calculateStats();

  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PrivacyConsent
          isOpen={showConsentModal}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Study Companion</h1>
              <p className="text-sm text-gray-500">AI-Powered Focus Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Session Timer */}
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
              <Clock className="text-gray-600 w-4 h-4" />
              <span className="font-mono text-lg font-medium text-gray-900">
                {sessionTimer}
              </span>
            </div>
            
            {/* Settings */}
            <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(true)}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Camera Feed & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed onDetection={handleDetection} />
            
            {session && (
              <FocusChart
                events={events}
                sessionStart={new Date(session.startTime!)}
              />
            )}
          </div>

          {/* Right Column: Status & Stats */}
          <div className="space-y-6">
            <StatusPanel
              currentState={currentState}
              confidence={lastDetection?.confidence}
            />
            
            <SessionStats
              stats={stats}
              formatTime={formatTime}
            />
            
            <QuickActions
              onPauseSession={handlePauseSession}
              onTakeBreak={handleTakeBreak}
              onEndSession={handleEndSession}
              isPaused={isPaused}
            />
          </div>
        </div>
      </main>

      {/* Focus Nudge Notification */}
      <FocusNudge
        state={nudgeState}
        onDismiss={() => setNudgeState(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}
