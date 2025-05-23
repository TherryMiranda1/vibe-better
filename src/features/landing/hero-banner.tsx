// src/components/landing/hero-banner.tsx
"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const defaultAnimatedWords = ["Prompts", "Hours", "Dollars"];
const WORD_VISIBLE_DURATION = 3000; // Time a full word stays visible
const TYPING_SPEED_MS = 100; // Speed of typing each character
const DELETING_SPEED_MS = 70; // Speed of deleting each character

interface HeroBannerProps {
  tagline?: string;
  titlePrefix?: string;
  animatedWords?: string[];
  descriptionText?: string;

  children?: React.ReactNode;
}

export function HeroBanner({
  tagline = "Powered by Clerk",
  titlePrefix = "Save hundreds of ",
  animatedWords = defaultAnimatedWords,
  descriptionText = "Refine your prompts, generate flawless code with AI in seconds. Turn clear ideas into real results and boost your productivity.",
  children,
}: HeroBannerProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const validAnimatedWords =
    animatedWords && animatedWords.length > 0
      ? animatedWords
      : defaultAnimatedWords;

  const handleTypingLogic = useCallback(() => {
    const currentWord = validAnimatedWords[wordIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText((prev) => prev.substring(0, prev.length - 1));
        }, DELETING_SPEED_MS);
      } else {
        // Finished deleting
        setIsDeleting(false);
        setWordIndex(
          (prevIndex) => (prevIndex + 1) % validAnimatedWords.length
        );
        // setCurrentText(''); // Ensure text is empty before typing next word
      }
    } else {
      // Typing
      if (currentText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setCurrentText((prev) => currentWord.substring(0, prev.length + 1));
        }, TYPING_SPEED_MS);
      } else {
        // Finished typing, wait before starting to delete
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, WORD_VISIBLE_DURATION);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [currentText, isDeleting, wordIndex, validAnimatedWords]);

  useEffect(() => {
    if (validAnimatedWords.length === 0) return; // No words to animate
    const cleanup = handleTypingLogic();
    return cleanup;
  }, [handleTypingLogic, validAnimatedWords.length]);

  // Effect to initialize the first word if it's empty
  useEffect(() => {
    if (validAnimatedWords.length > 0 && currentText === "" && !isDeleting) {
      setCurrentText(validAnimatedWords[wordIndex].substring(0, 1));
    }
  }, [validAnimatedWords, wordIndex, currentText, isDeleting]);

  return (
    <div className="py-16 mx-auto text-center relative z-10">
      {tagline && (
        <Link
          href="https://clerk.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-medium mb-6 shadow-md"
        >
          {tagline}
        </Link>
      )}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 mt-6 text-center">
        {titlePrefix}{" "}
        <span className="block text-primary min-w-[180px] sm:min-w-[250px] md:min-w-[320px] text-center">
          {currentText}
          <span className="animate-pulse">|</span> {/* Blinking cursor */}
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
        {descriptionText}
      </p>

      <div className="mt-16">{children}</div>
    </div>
  );
}
