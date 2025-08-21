import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, registerables, ChartConfiguration } from "chart.js";
import type { SessionEvent } from "@shared/schema";
import type { FocusState } from "../types";

Chart.register(...registerables);

interface FocusChartProps {
  events: SessionEvent[];
  sessionStart: Date;
}

export function FocusChart({ events, sessionStart }: FocusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Generate time labels and data points
    const now = new Date();
    const timeSpan = Math.max(3600000, now.getTime() - sessionStart.getTime()); // At least 1 hour
    const startTime = new Date(now.getTime() - timeSpan);
    
    const labels: string[] = [];
    const focusData: number[] = [];
    const drowsyData: number[] = [];
    const distractedData: number[] = [];
    const stressedData: number[] = [];

    // Create time points every minute
    const interval = 60000; // 1 minute
    const points = Math.ceil(timeSpan / interval);

    for (let i = 0; i <= points; i++) {
      const time = new Date(startTime.getTime() + i * interval);
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));

      // Find the most recent event before this time point
      let currentState: FocusState = "FOCUSED";
      
      for (const event of events) {
        const eventTime = new Date(event.timestamp);
        if (eventTime <= time) {
          currentState = event.state as FocusState;
        } else {
          break;
        }
      }

      // Only show data for time points after session started
      const value = time >= sessionStart ? 70 + Math.random() * 30 : 0;
      
      focusData.push(currentState === "FOCUSED" && time >= sessionStart ? value : 0);
      drowsyData.push(currentState === "DROWSY" && time >= sessionStart ? value : 0);
      distractedData.push(currentState === "DISTRACTED" && time >= sessionStart ? value : 0);
      stressedData.push(currentState === "STRESSED" && time >= sessionStart ? value : 0);
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Focused',
            data: focusData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Drowsy',
            data: drowsyData,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Distracted',
            data: distractedData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Stressed',
            data: stressedData,
            borderColor: '#F97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              display: false,
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [events, sessionStart]);

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Focus Timeline
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Drowsy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Distracted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Stressed</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="h-64 w-full">
          <canvas ref={canvasRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
