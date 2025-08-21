import { DetectionResult, FocusState } from "../types";

export class MockDetectionService {
  private lastDetection: DetectionResult | null = null;
  private detectionHistory: DetectionResult[] = [];
  private sessionStartTime: Date = new Date();
  private consecutiveStateCount: number = 0;
  private lastStateChange: Date = new Date();

  async processFrame(videoElement: HTMLVideoElement): Promise<DetectionResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock detection result with realistic patterns
    const states: FocusState[] = ["FOCUSED", "DROWSY", "DISTRACTED", "STRESSED"];
    
    // More realistic weights - much more varied for testing
    const baseWeights = [0.30, 0.30, 0.30, 0.10];
    
    // Adjust weights based on session duration (people get more distracted over time)
    const sessionDuration = (Date.now() - this.sessionStartTime.getTime()) / (1000 * 60); // minutes
    const fatigueMultiplier = Math.min(1.5, 1 + sessionDuration * 0.02); // Gradually increase distraction
    
    const adjustedWeights = [
      baseWeights[0] / fatigueMultiplier, // Focused decreases over time
      baseWeights[1] * fatigueMultiplier, // Drowsy increases over time
      baseWeights[2] * Math.min(1.3, fatigueMultiplier), // Distracted increases
      baseWeights[3] * Math.min(1.2, fatigueMultiplier)  // Stressed increases slightly
    ];
    
    // Normalize weights
    const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = adjustedWeights.map(w => w / totalWeight);
    
    let randomValue = Math.random();
    let selectedState: FocusState = states[0];
    
    for (let i = 0; i < normalizedWeights.length; i++) {
      randomValue -= normalizedWeights[i];
      if (randomValue <= 0) {
        selectedState = states[i];
        break;
      }
    }

    // Reduced temporal consistency for more responsive testing
    const timeSinceLastChange = Date.now() - this.lastStateChange.getTime();
    if (this.lastDetection && timeSinceLastChange < 3000) { // Reduced to 3 seconds
      if (Math.random() < 0.4) { // Reduced probability to 40%
        selectedState = this.lastDetection.state;
        this.consecutiveStateCount++;
      }
    }

    // But also prevent staying in non-focused states too long
    if (this.lastDetection && selectedState === this.lastDetection.state) {
      this.consecutiveStateCount++;
      
      // If distracted/drowsy for too long, occasionally snap back to focused
      if ((selectedState === "DISTRACTED" || selectedState === "DROWSY") && 
          this.consecutiveStateCount > 4 && Math.random() < 0.3) {
        selectedState = "FOCUSED";
        this.consecutiveStateCount = 0;
        this.lastStateChange = new Date();
      }
    } else {
      this.consecutiveStateCount = 0;
      this.lastStateChange = new Date();
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

  // Method to manually trigger a state for testing
  triggerState(state: FocusState): void {
    this.consecutiveStateCount = 0;
    this.lastStateChange = new Date();
  }

  // Reset session timer
  resetSession(): void {
    this.sessionStartTime = new Date();
    this.consecutiveStateCount = 0;
    this.lastStateChange = new Date();
  }
}

export const mockDetectionService = new MockDetectionService();
