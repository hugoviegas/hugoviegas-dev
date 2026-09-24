import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

import slides from "./slides";
import styles from "./PropostaPresentation.module.css";

const PropostaPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const totalSlides = slides.length;

  const { Component, title, accent } = useMemo(
    () => slides[currentSlide],
    [currentSlide]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide || isTransitioning) return;
      if (index < 0 || index >= totalSlides) return;

      setIsTransitioning(true);
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      setCurrentSlide(index);
      window.scrollTo({ top: 0, behavior: "smooth" });

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 420);
    },
    [currentSlide, isTransitioning, totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
  }, [currentSlide, goToSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    goToSlide(Math.max(currentSlide - 1, 0));
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          event.preventDefault();
          nextSlide();
          break;
        case "Home":
          event.preventDefault();
          goToSlide(0);
          break;
        case "End":
          event.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToSlide, isTransitioning, nextSlide, prevSlide, totalSlides]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => undefined);
    } else {
      document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className={styles.proposalPage}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.slideTitle}>{title}</div>

      <main className={styles.stage}>
        <div className={styles.slideWrapper}>
          <article
            className={clsx(styles.slideCard, {
              [styles.transitioning]: isTransitioning,
            })}
            data-accent={accent}
          >
            <Component />
          </article>
        </div>
      </main>

      <footer className={styles.navigationBar}>
        <button
          type="button"
          onClick={prevSlide}
          className={styles.navButton}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={20} />
        </button>
        <div className={styles.counter}>
          <span>{String(currentSlide + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(totalSlides).padStart(2, "0")}</span>
        </div>
        <div className={styles.indicators}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={clsx(styles.indicator, {
                [styles.indicatorActive]: index === currentSlide,
              })}
              aria-label={`Ir para a seção ${slide.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={nextSlide}
          className={styles.navButton}
          disabled={currentSlide === totalSlides - 1}
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={styles.navButton}
        >
          <Maximize2 size={18} />
        </button>
      </footer>
    </div>
  );
};

export default PropostaPresentation;
