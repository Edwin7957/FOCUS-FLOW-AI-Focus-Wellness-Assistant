import { useEffect, useState } from "react";
import { useCamera } from "@/hooks/use-camera";
import { mockDetectionService } from "@/lib/mock-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetectionResult } from "../types";

interface CameraFeedProps {
  onDetection?: (result: DetectionResult) => void;
}

export function CameraFeed({ onDetection }: CameraFeedProps) {
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<DetectionResult | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  useEffect(() => {
    let detectionInterval: NodeJS.Timeout | null = null;

    if (isActive && isDetecting && videoRef.current) {
      detectionInterval = setInterval(async () => {
        try {
          const result = await mockDetectionService.processFrame(videoRef.current!);
          setCurrentDetection(result);
          onDetection?.(result);
        } catch (error) {
          console.error("Detection error:", error);
        }
      }, 1000); // Detect every 1 second for more responsiveness
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, isDetecting, onDetection]);

  const handleStartDetection = async () => {
    if (!isActive) {
      await startCamera();
    }
    setIsDetecting(true);
  };

  const handleStopDetection = () => {
    setIsDetecting(false);
    setCurrentDetection(null);
  };

  if (error) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Error</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={startCamera} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Live Monitoring
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isDetecting ? "bg-green-500 animate-pulse" : "bg-gray-400"
            )} />
            <span className="text-sm text-gray-600">
              {isDetecting ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-gray-900 aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          
          {/* Detection Overlays */}
          {isDetecting && currentDetection && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Face Detection Box */}
              <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-green-500 rounded-lg opacity-80">
                <div className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Face Detected ({Math.round(currentDetection.confidence * 100)}%)
                </div>
              </div>
              
              {/* Eye Tracking Points */}
              {currentDetection.detections.face_detected && (
                <>
                  <div className="absolute top-1/3 left-2/5 w-2 h-2 bg-blue-400 rounded-full" />
                  <div className="absolute top-1/3 right-2/5 w-2 h-2 bg-blue-400 rounded-full" />
                </>
              )}

              {/* State Indicator */}
              <div className="absolute top-4 left-4">
                <div className={cn(
                  "px-3 py-1 rounded-lg text-white text-sm font-medium",
                  currentDetection.state === "FOCUSED" && "bg-green-500",
                  currentDetection.state === "DROWSY" && "bg-yellow-500",
                  currentDetection.state === "DISTRACTED" && "bg-red-500",
                  currentDetection.state === "STRESSED" && "bg-orange-500"
                )}>
                  {currentDetection.state}
                </div>
              </div>
            </div>
          )}
          
          {/* No video message */}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <VideoOff className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Camera Not Active</p>
                <p className="text-sm opacity-75">Click "Start Detection" to begin</p>
              </div>
            </div>
          )}
          
          {/* Camera Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              size="icon"
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border-0"
              onClick={isDetecting ? handleStopDetection : handleStartDetection}
            >
              {isActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border-0"
              onClick={() => setIsMicEnabled(!isMicEnabled)}
            >
              {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
