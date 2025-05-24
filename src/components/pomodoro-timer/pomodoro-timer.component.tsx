import styles from "./pomodoro-timer.module.css";
import { CircularProgressBar } from "../circular-progress-bar/circular-progress-bar.component";
import { usePomodoroTimer } from "./use-pomodoro-timer.hook";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { formatTime } from "./format-time.util";
import FlipAnimate from "../flip-animate/FlipAnimate";
import { usePomodoroSettings } from "./usePomodoroSettings";
import { PomodoroSettingsPanel } from "./PomodoroSettingsPanel";

export function PomodoroTimer() {
  const { settings, updateSetting } = usePomodoroSettings();
  const {
    leftTime,
    activity,
    status,
    sessionCount,
    toggleRunPause,
    reset,
    skip,
    setActivityManually,
  } = usePomodoroTimer(settings);

  const activityColor = {
    working: "#22c166",
    shortBreak: "#3174fe",
    longBreak: "#ff656a",
  }[activity];

  const activityText = {
    working: `Stay focus for ${Math.floor(settings.working / 60)} minutes`,
    shortBreak: `Take a short break for ${Math.floor(
      settings.shortBreak / 60
    )} minutes`,
    longBreak: `Take a long break for ${Math.floor(
      settings.longBreak / 60
    )} minutes`,
  }[activity];

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activity === "working" ? styles.active : ""
          }`}
          onClick={() => setActivityManually("working")}
        >
          Focus
        </button>
        <button
          className={`${styles.tabButton} ${
            activity === "shortBreak" ? styles.active : ""
          }`}
          onClick={() => setActivityManually("shortBreak")}
        >
          Short Break
        </button>
        <button
          className={`${styles.tabButton} ${
            activity === "longBreak" ? styles.active : ""
          }`}
          onClick={() => setActivityManually("longBreak")}
        >
          Long Break
        </button>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <CircularProgressBar
          progress={leftTime / settings[activity]}
          color={activityColor}
        >
          <div className={styles.info}>
            <p className={styles.leftTime}>
              {formatTime(leftTime)
                .split("")
                .map((char, idx) => (
                  <FlipAnimate key={idx} value={char} />
                ))}
            </p>
            <p className={styles.sessionCount}>Session: {sessionCount}</p>
          </div>
        </CircularProgressBar>
      </div>

      <p className={styles.activity}>{activityText}</p>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button
          className={
            status === "running" ? styles.pauseButton : styles.startButton
          }
          onClick={toggleRunPause}
          type="button"
        >
          {status === "running" ? (
            <IconPlayerPauseFilled />
          ) : (
            <IconPlayerPlayFilled />
          )}
        </button>

        <button
          className={styles.stopButton}
          onClick={reset}
          type="button"
          disabled={status === "stopped"}
        >
          Reset
        </button>

        <button className={styles.skipButton} onClick={skip} type="button">
          Skip
        </button>
      </div>
      <PomodoroSettingsPanel />
    </div>
  );
}
