"use client";

import { useEffect, useState } from "react";
import "./FlipAnimate.css";

interface FlipAnimateProps {
  value: string;
}

export default function FlipAnimate({ value }: FlipAnimateProps) {
  const [current, setCurrent] = useState(value);
  const [next, setNext] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== current) {
      setNext(value);
      setIsFlipping(true);

      const timeout = setTimeout(() => {
        setCurrent(value);
        setIsFlipping(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [value, current]);

  return (
    <span
      className={`flip-animate ${isFlipping ? "do-flip" : ""}`}
      data-flip={next}
    >
      {current}
    </span>
  );
}
