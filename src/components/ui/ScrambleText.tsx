import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "framer-motion";

const HIDDEN = 0;
const SCRAMBLED = 1;
const REVEALED = 2;

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) {
  if (fromLow === fromHigh) {
    return toLow;
  }
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function consolidateSegments(segments: [string, number][]) {
  return segments.filter(([text]) => text.length > 0).reduce((acc: [string, number][], curr) => {
    if (acc.length === 0 || acc[acc.length - 1][1] !== curr[1]) {
      acc.push([...curr]);
    } else {
      acc[acc.length - 1][0] += curr[0];
    }
    return acc;
  }, []);
}

const randomString = (length: number, characters: string) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

interface ScrambleTextProps {
  text: string;
  characters?: string;
  scrambledColor?: string;
  delay?: number;
}

export function ScrambleText({
  text,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?~",
  scrambledColor = "var(--text-muted)",
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const encryptedText = useRef(randomString(text.length, characters));
  const intervalRef = useRef<any>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });

  const scrambledLetters = 10;
  const characterDelay = 0.015; // fast scramble

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          encryptedText.current = randomString(text.length, characters);
        }, characterDelay * 1000);

        animate(0, 1, {
          type: "tween",
          ease: "linear",
          duration: characterDelay * (text.length + scrambledLetters),
          onUpdate: setProgress,
          onComplete: () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        });
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, delay, text.length, characters]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const leftCutoff = mapRange(progress, 0, 1, -scrambledLetters, text.length);
  const rightCutoff = mapRange(progress, 0, 1, 0, text.length + scrambledLetters);

  const segments: [string, number][] = [
    [text.substring(0, clamp(leftCutoff, 0, text.length)), REVEALED],
    [encryptedText.current.substring(clamp(leftCutoff, 0, text.length), clamp(rightCutoff, 0, text.length)), SCRAMBLED],
    [text.substring(clamp(rightCutoff, 0, text.length)), HIDDEN],
  ];

  return (
    <span ref={ref}>
      {consolidateSegments(segments).map(([str, state], index) => {
        if (state === HIDDEN) {
          return <span key={index} style={{ opacity: 0 }}>{str}</span>;
        }
        if (state === SCRAMBLED) {
          return <span key={index} style={{ color: scrambledColor }}>{str}</span>;
        }
        return <span key={index}>{str}</span>;
      })}
    </span>
  );
}
