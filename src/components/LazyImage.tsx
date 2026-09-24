import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder,
}: LazyImageProps) => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-lg bg-muted">
          <span className="text-sm text-muted-foreground">
            {placeholder ?? t("loadingProfile")}
          </span>
        </div>
      )}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted">
          <span className="text-sm text-muted-foreground">
            {t("imageFailed")}
          </span>
        </div>
      )}
    </div>
  );
};
