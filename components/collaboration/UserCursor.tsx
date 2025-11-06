"use client";

import { MousePointer2 } from "lucide-react";

interface UserCursorProps {
  x: number;
  y: number;
  name: string;
  color: string;
}

export default function UserCursor({ x, y, name, color }: UserCursorProps) {
  return (
    <div
      className="absolute pointer-events-none transition-all duration-100 ease-out z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-2px, -2px)",
      }}
    >
      {/* Cursor icon */}
      <MousePointer2
        size={20}
        style={{ color }}
        className="drop-shadow-md"
        fill={color}
      />

      {/* User name label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-md"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
}
