import { useState, useEffect } from 'react';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: string;
  duration?: number;
}

const StatItem = ({ value, label, suffix = '', icon = '', duration = 2000 }: StatItemProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <div className="text-center p-6 glass rounded-xl hover:glass-strong transition-all duration-300">
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <div className="text-4xl font-bold text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: 4, label: 'Years Experience', suffix: '+', icon: '💼' },
    { value: 90, label: 'Process Efficiency', suffix: '%', icon: '⚡' },
    { value: 15, label: 'Projects Completed', suffix: '+', icon: '🚀' },
    { value: 100, label: 'Client Satisfaction', suffix: '%', icon: '⭐' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          value={stat.value}
          label={stat.label}
          suffix={stat.suffix}
          icon={stat.icon}
          duration={1500 + index * 200}
        />
      ))}
    </div>
  );
};

export default StatsSection;
