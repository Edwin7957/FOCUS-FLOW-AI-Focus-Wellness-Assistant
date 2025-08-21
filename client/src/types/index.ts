export type FocusState = "FOCUSED" | "DROWSY" | "DISTRACTED" | "STRESSED";

export interface DetectionResult {
  state: FocusState;
  confidence: number;
  timestamp: string;
  detections: {
    face_detected: boolean;
    eye_aspect_ratio: number;
    head_pose: {
      yaw: number;
      pitch: number;
      roll: number;
    };
    stress_indicators: {
      facial_tension: number;
      blink_rate: number;
    };
  };
}

export interface SessionStats {
  focusScore: number;
  focusedTime: number;
  drowsyTime: number;
  distractedTime: number;
  stressedTime: number;
  totalDuration: number;
}

export interface SessionEvent {
  id: string;
  sessionId: string;
  timestamp: Date;
  state: FocusState;
  confidence: number;
}
