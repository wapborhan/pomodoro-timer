import { useState, useEffect } from "react";

export type PomodoroActivity = "working" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
  working: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  working: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  longBreakInterval: 3,
};

export function usePomodoroSettings() {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  }, [settings]);

  function updateSetting(key: keyof PomodoroSettings, value: number) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return { settings, updateSetting };
}
