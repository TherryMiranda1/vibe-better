"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 24,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverValue ?? value) >= starValue;

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "focus:outline-none transition-colors",
              isFilled ? "text-yellow-400" : "text-gray-300"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
          >
            <Star
              size={size}
              fill={isFilled ? "currentColor" : "none"}
              className={cn(
                "transition-transform",
                hoverValue === starValue && "scale-110"
              )}
            />
            <span className="sr-only">{starValue} stars</span>
          </button>
        );
      })}
    </div>
  );
}
