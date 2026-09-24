import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar, Zap, TrendingUp, Globe } from "lucide-react";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  duration?: number;
}

const StatItem = ({
  value,
  label,
  suffix = "",
  icon,
  duration = 2000,
}: StatItemProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let frame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <div className="glass-card p-5 text-center transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
      {icon && (
        <div className="mb-2 flex justify-center" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="caption-text">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      value: 90,
      label: t("stats.processReduction"),
      suffix: "%",
      icon: (
        <Zap className="h-7 w-7 text-orange-600 dark:text-orange-400" />
      ),
    },
    {
      value: 20,
      label: t("stats.viewsGrowth"),
      suffix: "%",
      icon: (
        <TrendingUp className="h-7 w-7 text-blue-600 dark:text-blue-400" />
      ),
    },
    {
      value: 4,
      label: t("stats.yearsExperience"),
      suffix: "+",
      icon: (
        <Calendar className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      value: 2,
      label: t("stats.countriesWorked"),
      suffix: "",
      icon: <Globe className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {stats.map((stat, index) => (
        <StatItem
          key={stat.label}
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
