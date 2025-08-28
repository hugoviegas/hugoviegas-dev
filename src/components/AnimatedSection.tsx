import { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
  threshold?: number;
}

export const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-1000 ease-out';
    const invisibleClasses = 'opacity-0 translate-y-8 scale-95';

    if (!isVisible) return `${baseClasses} ${invisibleClasses}`;

    switch (animation) {
      case 'fade-in':
        return `${baseClasses} opacity-100`;
      case 'slide-up':
        return `${baseClasses} opacity-100 translate-y-0`;
      case 'slide-left':
        return `${baseClasses} opacity-100 translate-x-0`;
      case 'slide-right':
        return `${baseClasses} opacity-100 -translate-x-0`;
      case 'scale-in':
        return `${baseClasses} opacity-100 scale-100`;
      default:
        return `${baseClasses} opacity-100`;
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClasses()}`}
      style={{
        transform: isVisible ? 'none' : getInitialTransform(animation)
      }}
    >
      {children}
    </div>
  );
};

const getInitialTransform = (animation: string) => {
  switch (animation) {
    case 'slide-up':
      return 'translateY(2rem)';
    case 'slide-left':
      return 'translateX(-2rem)';
    case 'slide-right':
      return 'translateX(2rem)';
    case 'scale-in':
      return 'scale(0.95)';
    default:
      return 'none';
  }
};
