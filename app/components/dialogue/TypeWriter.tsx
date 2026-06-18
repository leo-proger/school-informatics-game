"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypeWriter({
  text,
  speed = 20,
  onComplete,
}: Props) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed("");

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);

        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <p
      className="
      whitespace-pre-wrap
      text-xl
      leading-9
      text-white
      tracking-wide
      "
    >
      {displayed}
    </p>
  );
}