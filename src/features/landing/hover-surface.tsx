import React, { useState } from "react";

interface HoverSurfaceProps {
  children: React.ReactNode;
}

export const HoverSurface = ({ children }: HoverSurfaceProps) => {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - left) / width) * 100;
    const yPercent = ((e.clientY - top) / height) * 100;
    setCoords({ x: xPercent, y: yPercent });
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={
        {
          "--mouse-x": `${coords.x}%`,
          "--mouse-y": `${coords.y}%`,
          cursor: "none",
        } as React.CSSProperties
      }
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/50 z-10" />

      {/* Hover lighting effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          background: `
            radial-gradient(
              circle at var(--mouse-x) var(--mouse-y),
              rgba(0, 255, 255, 0.05) 0%,
              transparent 50%
            )
          `,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Custom SVG cursor (neon arrow) */}
      {hovered && (
        <svg
          className="fixed z-50 pointer-events-none"
          style={{
            top: cursorPos.y - 16,
            left: cursorPos.x - 16,
            position: "fixed",
            opacity: 0.85,
            width: 32,
            height: 32,
            filter: "drop-shadow(0 0 6px rgba(0, 255, 255, 0.8))",
            transform: "rotate(-115deg)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="cyan"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4L20 12L4 20L8 12L4 4Z" />
        </svg>
      )}
      {/* Hero content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        {children}
      </div>
    </div>
  );
};
