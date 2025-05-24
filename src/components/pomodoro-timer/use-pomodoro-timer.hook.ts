import { useEffect, useRef, useState } from "react";
import { PomodoroSettings } from "./usePomodoroSettings";

export type PomodoroActivity = "working" | "shortBreak" | "longBreak";
export type PomodoroStatus = "running" | "paused" | "stopped";

const alarmSound = new Audio("/alarm.mp3");

export function usePomodoroTimer(settings: PomodoroSettings) {
  const [leftTime, setLeftTime] = useState(settings.working);
  const [status, setStatus] = useState<PomodoroStatus>("stopped");
  const [activity, setActivity] = useState<PomodoroActivity>("working");
  const [sessionCount, setSessionCount] = useState(1);

  const timeoutRef = useRef<number | undefined>(undefined);

  function saveSession(type: "complete" | "skipped") {
    const history = JSON.parse(localStorage.getItem("pomodoroSessions") || "[]");
    const newEntry = {
      type,
      activity,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("pomodoroSessions", JSON.stringify([...history, newEntry]));
  }

  function setNewTimeout(
    activity: PomodoroActivity,
    leftTime: number,
    sessionCount: number
  ) {
    timeoutRef.current = setTimeout(
      getTimeoutCallback(activity, leftTime, sessionCount),
      1000
    );
  }

  function getTimeoutCallback(
    activity: PomodoroActivity,
    leftTime: number,
    sessionCount: number
  ) {
    const initialTimestamp = Date.now();

    return () => {
      const elapsed = Date.now() - initialTimestamp;
      let newLeftTime = leftTime - Math.round(elapsed / 1000);

      if (newLeftTime > 0) {
        setLeftTime(newLeftTime);
        setNewTimeout(activity, newLeftTime, sessionCount);
        return;
      }

      alarmSound.play();
      saveSession("complete");

      let newSessionCount = sessionCount;
      let newActivity = activity;

      if (activity === "shortBreak" || activity === "longBreak") {
        newActivity = "working";
        newSessionCount++;
      } else if (sessionCount % settings.longBreakInterval === 0) {
        newActivity = "longBreak";
      } else {
        newActivity = "shortBreak";
      }

      newLeftTime = settings[newActivity];
      setActivity(newActivity);
      setLeftTime(newLeftTime);
      setSessionCount(newSessionCount);
      setNewTimeout(newActivity, newLeftTime, newSessionCount);
    };
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function toggleRunPause() {
    if (status === "running") {
      pause();
    } else {
      run();
    }
  }

  function run() {
    setStatus("running");
    setNewTimeout(activity, leftTime, sessionCount);
  }

  function pause() {
    setStatus("paused");
    clearTimeout(timeoutRef.current);
  }

  function reset() {
    clearTimeout(timeoutRef.current);
    setLeftTime(settings[activity]);
    setStatus("stopped");
  }

  function skip() {
    clearTimeout(timeoutRef.current);
    saveSession("skipped");

    let newSessionCount = sessionCount;
    let newActivity = activity;

    if (activity === "shortBreak" || activity === "longBreak") {
      newActivity = "working";
      newSessionCount++;
    } else if (sessionCount % settings.longBreakInterval === 0) {
      newActivity = "longBreak";
    } else {
      newActivity = "shortBreak";
    }

    setActivity(newActivity);
    setLeftTime(settings[newActivity]);
    setSessionCount(newSessionCount);
    setStatus("stopped");
  }

  function setActivityManually(newActivity: PomodoroActivity) {
    clearTimeout(timeoutRef.current);
    setActivity(newActivity);
    setLeftTime(settings[newActivity]);
    setSessionCount(1);
    setStatus("stopped");
  }

  return {
    leftTime,
    activity,
    status,
    sessionCount,
    toggleRunPause,
    reset,
    skip,
    setActivityManually,
  };
}
