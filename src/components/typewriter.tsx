
'use client';

import { useState, useEffect, type HTMLAttributes } from 'react';

interface TypewriterProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, className, ...props }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [text, currentIndex, speed]);

  return (
    <span className={className} {...props}>
      {displayedText}
    </span>
  );
};

export default Typewriter;
