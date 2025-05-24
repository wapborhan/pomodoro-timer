import styles from "./app.module.css";

import { PomodoroTimer } from "./components/pomodoro-timer/pomodoro-timer.component";

export default function App() {
  return (
    <div>
      <h1 className={styles.title}>Pomodoro Timer</h1>
      <PomodoroTimer />
    </div>
  );
}
