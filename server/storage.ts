import { type User, type InsertUser, type Session, type InsertSession, type SessionEvent, type InsertSessionEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  getCurrentSession(): Promise<Session | undefined>;
  
  // Session event methods
  addSessionEvent(event: InsertSessionEvent): Promise<SessionEvent>;
  getSessionEvents(sessionId: string): Promise<SessionEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private sessionEvents: Map<string, SessionEvent>;
  private currentSessionId: string | null = null;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.sessionEvents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      startTime: new Date(),
      endTime: null,
      totalDuration: 0,
      focusedTime: 0,
      drowsyTime: 0,
      distractedTime: 0,
      stressedTime: 0,
      focusScore: 0,
      currentState: "FOCUSED",
    };
    this.sessions.set(id, session);
    this.currentSessionId = id;
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getCurrentSession(): Promise<Session | undefined> {
    if (!this.currentSessionId) return undefined;
    return this.sessions.get(this.currentSessionId);
  }

  async addSessionEvent(insertEvent: InsertSessionEvent): Promise<SessionEvent> {
    const id = randomUUID();
    const event: SessionEvent = {
      ...insertEvent,
      id,
      timestamp: new Date(),
    };
    this.sessionEvents.set(id, event);
    return event;
  }

  async getSessionEvents(sessionId: string): Promise<SessionEvent[]> {
    return Array.from(this.sessionEvents.values()).filter(
      (event) => event.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
