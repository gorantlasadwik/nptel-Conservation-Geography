import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerType } from '../types/quiz';

interface UseTimerOptions {
  type: TimerType;
  countdownDurationSeconds?: number;
  onTimeExpired?: () => void;
  isRunning?: boolean;
}

export interface TimerState {
  timeRemaining: number; // for countdown
  timeElapsed: number; // for stopwatch / total time tracking
  isExpired: boolean;
  formattedTime: string;
}

export function useTimer({
  type,
  countdownDurationSeconds = 0,
  onTimeExpired,
  isRunning = true,
}: UseTimerOptions): TimerState {
  const [timeRemaining, setTimeRemaining] = useState<number>(countdownDurationSeconds);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Use refs to store anchor timestamps to prevent drift
  const startTimeRef = useRef<number>(Date.now());
  const deadlineRef = useRef<number>(Date.now() + countdownDurationSeconds * 1000);
  const onTimeExpiredRef = useRef(onTimeExpired);
  onTimeExpiredRef.current = onTimeExpired;

  // Reset or initialize anchors
  useEffect(() => {
    const now = Date.now();
    startTimeRef.current = now;
    deadlineRef.current = now + countdownDurationSeconds * 1000;
    setTimeRemaining(countdownDurationSeconds);
    setTimeElapsed(0);
    setIsExpired(false);
  }, [type, countdownDurationSeconds]);

  useEffect(() => {
    if (!isRunning || type === 'none' || isExpired) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();

      // Track elapsed seconds
      const elapsedSecs = Math.max(0, Math.floor((now - startTimeRef.current) / 1000));
      setTimeElapsed(elapsedSecs);

      if (type === 'countdown') {
        const remainingMillis = deadlineRef.current - now;
        const remainingSecs = Math.max(0, Math.ceil(remainingMillis / 1000));
        setTimeRemaining(remainingSecs);

        if (remainingMillis <= 0) {
          setIsExpired(true);
          window.clearInterval(intervalId);
          if (onTimeExpiredRef.current) {
            onTimeExpiredRef.current();
          }
        }
      }
    }, 250); // Polling every 250ms ensures smooth and drift-free second updates

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, type, isExpired]);

  const displaySeconds = type === 'countdown' ? timeRemaining : timeElapsed;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    timeRemaining,
    timeElapsed,
    isExpired,
    formattedTime,
  };
}
