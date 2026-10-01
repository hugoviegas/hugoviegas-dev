import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  // Above-the-fold image: load immediately with high fetch priority.
  priority?: boolean;
  width?: number;
  height?: number;
  // Shown instead when src fails to load (e.g. an uploaded file was removed).
  fallbackSrc?: string;
}

export const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder,
  priority = false,
  width,
  height,
  fallbackSrc,
}: LazyImageProps) => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
    setHasError(false);
  }, [src]);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;
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
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && !useFallback && fallbackSrc !== src) {
      setUseFallback(true);
      return;
    }
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
          src={useFallback ? fallbackSrc : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          // React 18 only forwards the lowercase attribute name.
          {...(priority ? { fetchpriority: "high" } : {})}
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
