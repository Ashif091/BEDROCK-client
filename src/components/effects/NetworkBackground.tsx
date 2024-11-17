'use client';

import React, { useMemo, useState, useEffect } from 'react';

export default function NetworkBackground() {
  const [isRendered, setIsRendered] = useState(false);

  const points = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      x: Math.random() * 200 - 50,
      y: Math.random() * 200 - 50,
    }));
  }, []);

  const connections = useMemo(() => {
    return points.flatMap((point, index) =>
      Array.from({ length: 2 }, () => {
        const targetIndex = Math.floor(Math.random() * points.length);
        return targetIndex !== index
          ? `M${point.x},${point.y} L${points[targetIndex].x},${points[targetIndex].y}`
          : null;
      }).filter(Boolean)
    );
  }, [points]);

  useEffect(() => {
    // Mimic async rendering or heavy computation.
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 0); // Adjust delay if necessary

    return () => clearTimeout(timer);
  }, []);

  if (!isRendered) {
    return null;
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
      style={{ filter: 'blur(0.5px)' }}
    >
      {/* Transparent Background */}
      <rect width="100%" height="100%" fill="transparent" />

      {/* Connections with opacity */}
      <g stroke="#d0d0d0" strokeWidth="0.2" opacity="0.1">
        {connections.map((d: any, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Points with opacity */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="0.4"
          fill="#a0a0a0"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}
