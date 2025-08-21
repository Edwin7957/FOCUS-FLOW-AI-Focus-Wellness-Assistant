import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Session, SessionEvent } from "@shared/schema";
import type { FocusState, SessionStats } from "../types";

export function useSession() {
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentState, setCurrentState] = useState<FocusState>("FOCUSED");
  const queryClient = useQueryClient();
  const statsInterval = useRef<NodeJS.Timeout | null>(null);

  // Get current session
  const { data: session, isLoading } = useQuery<Session>({
    queryKey: ["/api/sessions/current"],
    retry: false,
  });

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sessions", {
        userId: null,
      });
      return response.json();
    },
    onSuccess: (newSession: Session) => {
      queryClient.setQueryData(["/api/sessions/current"], newSession);
      setSessionStartTime(new Date(newSession.startTime!));
    },
  });

  // Update session
  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<Session>) => {
      if (!session?.id) throw new Error("No active session");
      const response = await apiRequest("PATCH", `/api/sessions/${session.id}`, updates);
      return response.json();
    },
    onSuccess: (updatedSession: Session) => {
      queryClient.setQueryData(["/api/sessions/current"], updatedSession);
    },
  });

  // Add session event
  const addEventMutation = useMutation({
    mutationFn: async ({ state, confidence }: { state: FocusState; confidence: number }) => {
      if (!session?.id) throw new Error("No active session");
      const response = await apiRequest("POST", `/api/sessions/${session.id}/events`, {
        state,
        confidence,
      });
      return response.json();
    },
    onSuccess: () => {
      if (session?.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/sessions", session.id, "events"] });
      }
    },
  });

  // Get session events for timeline
  const { data: events = [] } = useQuery<SessionEvent[]>({
    queryKey: ["/api/sessions", session?.id, "events"],
    enabled: !!session?.id,
  });

  const startSession = useCallback(async () => {
    await createSessionMutation.mutateAsync();
  }, [createSessionMutation]);

  const endSession = useCallback(async () => {
    if (!session) return;
    
    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - new Date(session.startTime!).getTime()) / 1000);
    
    await updateSessionMutation.mutateAsync({
      endTime,
      totalDuration,
    });

    if (statsInterval.current) {
      clearInterval(statsInterval.current);
      statsInterval.current = null;
    }
  }, [session, updateSessionMutation]);

  const updateState = useCallback(async (newState: FocusState, confidence: number = 0.8) => {
    setCurrentState(newState);
    if (session) {
      await addEventMutation.mutateAsync({ state: newState, confidence });
      
      // Update session current state
      await updateSessionMutation.mutateAsync({ currentState: newState });
    }
  }, [session, addEventMutation, updateSessionMutation]);

  const calculateStats = useCallback((): SessionStats => {
    if (!session || !events.length) {
      return {
        focusScore: 0,
        focusedTime: 0,
        drowsyTime: 0,
        distractedTime: 0,
        stressedTime: 0,
        totalDuration: 0,
      };
    }

    const now = new Date();
    const sessionStart = new Date(session.startTime!);
    const totalDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);

    // Calculate time in each state based on events
    const stateDurations = {
      FOCUSED: 0,
      DROWSY: 0,
      DISTRACTED: 0,
      STRESSED: 0,
    };

    // Process events chronologically
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let currentEventState: FocusState = "FOCUSED";
    let lastEventTime = sessionStart;

    sortedEvents.forEach((event, index) => {
      const eventTime = new Date(event.timestamp);
      const duration = Math.floor((eventTime.getTime() - lastEventTime.getTime()) / 1000);
      
      stateDurations[currentEventState] += duration;
      currentEventState = event.state as FocusState;
      lastEventTime = eventTime;
    });

    // Add time from last event to now
    const remainingDuration = Math.floor((now.getTime() - lastEventTime.getTime()) / 1000);
    stateDurations[currentEventState] += remainingDuration;

    const focusScore = totalDuration > 0 ? Math.round((stateDurations.FOCUSED / totalDuration) * 100) : 0;

    return {
      focusScore,
      focusedTime: stateDurations.FOCUSED,
      drowsyTime: stateDurations.DROWSY,
      distractedTime: stateDurations.DISTRACTED,
      stressedTime: stateDurations.STRESSED,
      totalDuration,
    };
  }, [session, events]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  }, []);

  const getSessionTimer = useCallback((): string => {
    if (!sessionStartTime) return "00:00:00";
    
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [sessionStartTime]);

  // Update session stats periodically
  useEffect(() => {
    if (session && !statsInterval.current) {
      statsInterval.current = setInterval(async () => {
        const stats = calculateStats();
        await updateSessionMutation.mutateAsync({
          focusScore: stats.focusScore,
          focusedTime: stats.focusedTime,
          drowsyTime: stats.drowsyTime,
          distractedTime: stats.distractedTime,
          stressedTime: stats.stressedTime,
          totalDuration: stats.totalDuration,
        });
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (statsInterval.current) {
        clearInterval(statsInterval.current);
        statsInterval.current = null;
      }
    };
  }, [session, calculateStats, updateSessionMutation]);

  return {
    session,
    events,
    currentState,
    isLoading,
    startSession,
    endSession,
    updateState,
    calculateStats,
    formatTime,
    getSessionTimer,
    isCreatingSession: createSessionMutation.isPending,
  };
}
