import React, { useMemo } from "react";

type Dot = {
  colorVar: string;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

const AmbientDots: React.FC<{ count?: number }> = ({ count = 10 }) => {
  const dots: Dot[] = useMemo(() => {
    const colorVars = ["--primary", "--secondary", "--accent"];
    return Array.from({ length: count }).map(() => {
      const colorVar = colorVars[Math.floor(Math.random() * colorVars.length)];
      return {
        colorVar,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 24 + Math.random() * 160,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 10,
      } as Dot;
    });
  }, [count]);

  return (
    <div className="ambient-container" aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className="ambient-dot"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            background: `hsl(var(${d.colorVar}) / 0.12)`,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientDots;
