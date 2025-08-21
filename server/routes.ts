import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, insertSessionEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new study session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data", error });
    }
  });

  // Get current active session
  app.get("/api/sessions/current", async (req, res) => {
    try {
      const session = await storage.getCurrentSession();
      if (!session) {
        return res.status(404).json({ message: "No active session found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Error fetching current session", error });
    }
  });

  // Update current session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateSession(id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Error updating session", error });
    }
  });

  // Add session event (state change)
  app.post("/api/sessions/:id/events", async (req, res) => {
    try {
      const { id } = req.params;
      const eventData = insertSessionEventSchema.parse({
        ...req.body,
        sessionId: id,
      });
      const event = await storage.addSessionEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error });
    }
  });

  // Get session events for timeline
  app.get("/api/sessions/:id/events", async (req, res) => {
    try {
      const { id } = req.params;
      const events = await storage.getSessionEvents(id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching session events", error });
    }
  });

  // Mock detection endpoint - simulates AI processing
  app.post("/api/detect", async (req, res) => {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock detection results with some randomness
      const states = ["FOCUSED", "DROWSY", "DISTRACTED", "STRESSED"];
      const weights = [0.6, 0.2, 0.15, 0.05]; // Bias towards focused state
      
      let randomValue = Math.random();
      let selectedState = states[0];
      
      for (let i = 0; i < weights.length; i++) {
        randomValue -= weights[i];
        if (randomValue <= 0) {
          selectedState = states[i];
          break;
        }
      }
      
      const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
      
      const result = {
        state: selectedState,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        detections: {
          face_detected: true,
          eye_aspect_ratio: 0.25 + Math.random() * 0.1,
          head_pose: {
            yaw: (Math.random() - 0.5) * 30,
            pitch: (Math.random() - 0.5) * 20,
            roll: (Math.random() - 0.5) * 15,
          },
          stress_indicators: {
            facial_tension: Math.random() * 0.5,
            blink_rate: 15 + Math.random() * 10,
          }
        }
      };
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error processing detection", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
