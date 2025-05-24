import { useEffect, useState } from "react";
import styles from "./circular-progress-bar.module.css";

export type CircularProgressBarProps = {
  progress: number;
  color?: string;
  children?: React.ReactNode;
};

export function CircularProgressBar({
  progress,
  color = "#1ebc61",
  children,
}: CircularProgressBarProps) {
  const [angle, setAngle] = useState(progress * 2 * Math.PI);

  const animationDuration = 1000;

  useEffect(() => {
    let start = 0;
    let animationId: number;

    const newAngle = progress * 2 * Math.PI;

    function getAnimationFunction(angle: number) {
      return (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        const angleDiff = newAngle - angle;

        const angleStep = angleDiff * Math.min(elapsed / animationDuration, 1);

        setAngle(angle + angleStep);

        if (elapsed < animationDuration) {
          animationId = requestAnimationFrame(
            getAnimationFunction(angle + angleStep),
          );
        }
      };
    }

    animationId = requestAnimationFrame(getAnimationFunction(angle));

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [progress]);

  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  let path = "";
  if (angle <= Math.PI / 2) {
    path = `M 50,50 V 0 H ${50 + 50 * angleSin} V ${50 - 50 * angleCos} Z`;
  } else if (angle <= Math.PI) {
    path = `M 50,50 V 0 H 100 V ${50 - 50 * angleCos} H ${50 + 50 * angleSin} Z`;
  } else if (angle <= (3 * Math.PI) / 2) {
    path = `M 50,50 V 0 H 100 V 100 H ${50 + 50 * angleSin} V ${50 - 50 * angleCos} Z`;
  } else {
    path = `M 50,50 V 0 H 100 V 100 H 0 V ${50 - 50 * angleCos} H ${50 + 50 * angleSin} Z`;
  }

  const svgStyle = {
    "--progress-color": color,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <svg className={styles.bar} viewBox="0 0 100 100" style={svgStyle}>
        <path d={path} />
      </svg>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
