import { useState } from "react";
import { usePomodoroSettings } from "./usePomodoroSettings";

export function PomodoroSettingsPanel() {
  const { settings, updateSetting } = usePomodoroSettings();

  const [focusTime, setFocusTime] = useState(settings.working / 60);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak / 60);
  const [longBreak, setLongBreak] = useState(settings.longBreak / 60);
  const [longBreakInterval, setLongBreakInterval] = useState(
    settings.longBreakInterval
  );

  const handleUpdate = () => {
    updateSetting("working", focusTime * 60);
    updateSetting("shortBreak", shortBreak * 60);
    updateSetting("longBreak", longBreak * 60);
    updateSetting("longBreakInterval", longBreakInterval);
    alert("Settings updated!");
  };

  return (
    <div>
      <h3>Settings</h3>
      <label>
        Focus Time (minutes):
        <input
          type="number"
          value={focusTime}
          onChange={(e) => setFocusTime(Number(e.target.value))}
        />
      </label>
      <label>
        Short Break (minutes):
        <input
          type="number"
          value={shortBreak}
          onChange={(e) => setShortBreak(Number(e.target.value))}
        />
      </label>
      <label>
        Long Break (minutes):
        <input
          type="number"
          value={longBreak}
          onChange={(e) => setLongBreak(Number(e.target.value))}
        />
      </label>
      <label>
        Long Break Interval (sessions):
        <input
          type="number"
          value={longBreakInterval}
          onChange={(e) => setLongBreakInterval(Number(e.target.value))}
        />
      </label>

      <button onClick={handleUpdate} type="button">
        Update
      </button>
    </div>
  );
}
