import { DetectionResult, FocusState } from "../types";

export class MockDetectionService {
  private lastDetection: DetectionResult | null = null;
  private detectionHistory: DetectionResult[] = [];

  async processFrame(videoElement: HTMLVideoElement): Promise<DetectionResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock detection result
    const states: FocusState[] = ["FOCUSED", "DROWSY", "DISTRACTED", "STRESSED"];
    const weights = [0.65, 0.2, 0.12, 0.03]; // Bias towards focused state
    
    let randomValue = Math.random();
    let selectedState: FocusState = states[0];
    
    for (let i = 0; i < weights.length; i++) {
      randomValue -= weights[i];
      if (randomValue <= 0) {
        selectedState = states[i];
        break;
      }
    }

    // Add some temporal consistency - if last state was not focused, 
    // have a higher chance of staying in that state for a bit
    if (this.lastDetection && this.lastDetection.state !== "FOCUSED" && Math.random() < 0.7) {
      selectedState = this.lastDetection.state;
    }

    const confidence = 0.75 + Math.random() * 0.25; // 75-100% confidence
    
    const result: DetectionResult = {
      state: selectedState,
      confidence: confidence,
      timestamp: new Date().toISOString(),
      detections: {
        face_detected: true,
        eye_aspect_ratio: selectedState === "DROWSY" ? 0.15 + Math.random() * 0.1 : 0.25 + Math.random() * 0.1,
        head_pose: {
          yaw: selectedState === "DISTRACTED" ? (Math.random() - 0.5) * 60 : (Math.random() - 0.5) * 20,
          pitch: (Math.random() - 0.5) * 20,
          roll: (Math.random() - 0.5) * 15,
        },
        stress_indicators: {
          facial_tension: selectedState === "STRESSED" ? 0.6 + Math.random() * 0.4 : Math.random() * 0.4,
          blink_rate: selectedState === "DROWSY" ? 8 + Math.random() * 5 : 15 + Math.random() * 10,
        }
      }
    };

    this.lastDetection = result;
    this.detectionHistory.push(result);
    
    // Keep only last 100 detections
    if (this.detectionHistory.length > 100) {
      this.detectionHistory.shift();
    }

    return result;
  }

  getDetectionHistory(): DetectionResult[] {
    return this.detectionHistory;
  }

  getCurrentState(): FocusState {
    return this.lastDetection?.state || "FOCUSED";
  }
}

export const mockDetectionService = new MockDetectionService();
