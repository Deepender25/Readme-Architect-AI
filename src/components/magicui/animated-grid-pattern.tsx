"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useRef(`grid-pattern-${Math.random()}`);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id.current}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id.current})`} />
      <svg x={x} y={y} className="overflow-visible">
        {Array.from({ length: numSquares }, (_, i) => (
          <motion.rect
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, maxOpacity, maxOpacity * 0.7, 0],
              scale: [0.5, 1.2, 1, 0.8]
            }}
            transition={{
              duration: duration + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: repeatDelay + Math.random() * 1,
              ease: "easeInOut",
              delay: Math.random() * (duration + repeatDelay),
              times: [0, 0.3, 0.7, 1]
            }}
            key={`${x}-${y}-${i}`}
            width={width - 1}
            height={height - 1}
            x={`${Math.random() * 100}%`}
            y={`${Math.random() * 100}%`}
            fill="rgba(0, 255, 136, 0.4)"
            stroke="rgba(0, 255, 136, 0.2)"
            strokeWidth="0.5"
            rx="2"
          />
        ))}
      </svg>
    </svg>
  );
}
