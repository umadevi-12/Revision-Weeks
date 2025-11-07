import React, { useEffect, useRef, useState } from "react";
import "../index.css";

export default function AnimatedBanner({
  texts = ["Create.", "Learn.", "Grow."],
  typingSpeed = 120,
  erasingSpeed = 60,
  delayBeforeErase = 1000,
  delayBeforeNext = 500,
  loop = true,
}) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const typingTimerRef = useRef(null);
  const erasingTimerRef = useRef(null);
  const delayTimerRef = useRef(null);

  useEffect(() => {
    const currentWord = texts[wordIndex % texts.length] || "";

    if (isTyping) {
      if (displayText === currentWord) {
        delayTimerRef.current = setTimeout(() => setIsTyping(false), delayBeforeErase);
      } else {
        typingTimerRef.current = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      }
    } else {
      if (displayText === "") {
        if (!loop && wordIndex >= texts.length - 1) return;

        setIsFading(true);
        delayTimerRef.current = setTimeout(() => {
          setIsFading(false);
          setIsTyping(true);
          setWordIndex((prev) => (prev + 1) % texts.length);
        }, delayBeforeNext);
      } else {
        erasingTimerRef.current = setTimeout(() => {
          setDisplayText((t) => t.slice(0, t.length - 1));
        }, erasingSpeed);
      }
    }

    return () => {
      clearTimeout(typingTimerRef.current);
      clearTimeout(erasingTimerRef.current);
      clearTimeout(delayTimerRef.current);
    };
  }, [
    displayText,
    isTyping,
    wordIndex,
    texts,
    typingSpeed,
    erasingSpeed,
    delayBeforeErase,
    delayBeforeNext,
    loop,
  ]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current);
      clearTimeout(erasingTimerRef.current);
      clearTimeout(delayTimerRef.current);
    };
  }, []);

  return (
    <div className="animated-banner" aria-live="polite">
      <span className={`text ${isFading ? "fade-out" : "fade-in"}`}>{displayText}</span>
      <span className="cursor">|</span>
    </div>
  );
}
