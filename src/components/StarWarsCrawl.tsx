import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type StarWarsCrawlOverlayProps = {
  open: boolean;
  title: string;
  story: string;
  onClose: () => void;
  episodeLabel?: string;
  introText?: string;
};

type CrawlPhase = "intro" | "crawl" | "final";

const EPISODE_FALLBACK = "Episode I";
const INTRO_FALLBACK = "A long time ago in a galaxy far, far away....";
const INTRO_DELAY_MS = 2000;
const CRAWL_DURATION_MS = 85000;
const FINAL_TRIGGER_RATIO = 0.98;

const splitStory = (story: string) =>
  story
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const StarWarsCrawlOverlay: React.FC<StarWarsCrawlOverlayProps> = ({
  open,
  title,
  story,
  onClose,
  episodeLabel = EPISODE_FALLBACK,
  introText = INTRO_FALLBACK,
}) => {
  const [phase, setPhase] = useState<CrawlPhase>("intro");
  const [paused, setPaused] = useState(false);
  const paragraphs = useMemo(() => splitStory(story), [story]);
  const closeRef = useRef(onClose);
  const timersRef = useRef<{ intro?: number; final?: number }>({});
  const finalEndRef = useRef<number | null>(null);
  const remainingRef = useRef<number | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!open) {
      setPhase("intro");
      return;
    }

    setPhase("intro");
    const timers = timersRef.current;
    const introTimer = window.setTimeout(
      () => setPhase("crawl"),
      INTRO_DELAY_MS
    );
    timers.intro = introTimer;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current?.();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      if (timers.intro) {
        window.clearTimeout(timers.intro);
        timers.intro = undefined;
      }
      if (timers.final) {
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (phase !== "crawl") {
      // leaving crawl: clear timing state
      const timers = timersRef.current;
      if (timers.final) {
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
      remainingRef.current = null;
      finalEndRef.current = null;
      setPaused(false);
      return;
    }

    const timers = timersRef.current;
    const triggerDelay = Math.max(
      1200,
      CRAWL_DURATION_MS * FINAL_TRIGGER_RATIO
    );
    // schedule final transition and store end timestamp so we can pause/resume
    const endAt = Date.now() + triggerDelay;
    finalEndRef.current = endAt;
    remainingRef.current = null;
    timers.final = window.setTimeout(() => {
      setPhase("final");
      const currentTimers = timersRef.current;
      currentTimers.final = undefined;
      finalEndRef.current = null;
      remainingRef.current = null;
    }, triggerDelay);

    return () => {
      if (timers.final) {
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
    };
  }, [phase]);

  // Pause / resume handlers
  const togglePause = () => {
    if (phase !== "crawl") return;
    const timers = timersRef.current;

    if (!paused) {
      // pause: compute remaining and clear timeout
      if (timers.final && finalEndRef.current) {
        const rem = Math.max(0, finalEndRef.current - Date.now());
        remainingRef.current = rem;
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
      setPaused(true);
      return;
    }

    // resume
    setPaused(false);
    const rem = remainingRef.current ?? 0;
    if (rem > 0) {
      finalEndRef.current = Date.now() + rem;
      timers.final = window.setTimeout(() => {
        setPhase("final");
        const currentTimers = timersRef.current;
        currentTimers.final = undefined;
        finalEndRef.current = null;
        remainingRef.current = null;
      }, rem);
      remainingRef.current = null;
    } else if (rem === 0) {
      // nothing left
      setPhase("final");
    }
  };

  const handleSkip = () => {
    const timers = timersRef.current;
    if (timers.intro) {
      window.clearTimeout(timers.intro);
      timers.intro = undefined;
    }
    if (timers.final) {
      window.clearTimeout(timers.final);
      timers.final = undefined;
    }
    finalEndRef.current = null;
    remainingRef.current = null;
    setPaused(false);
    setPhase("final");
  };

  if (typeof document === "undefined" || !open) {
    return null;
  }

  return createPortal(
    <div className="star-wars-overlay" role="dialog" aria-modal="true">
      <div className="star-wars-starfield" aria-hidden="true" />

      <button
        type="button"
        className="star-wars-close"
        onClick={onClose}
        aria-label="Close story crawl"
      >
        <X />
      </button>

      <div className="star-wars-inner">
        <div className="star-wars-controls" style={{ pointerEvents: "auto" }}>
          <button
            type="button"
            className="star-wars-control"
            onClick={togglePause}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? "▶" : "⏸"}
          </button>

          <button
            type="button"
            className="star-wars-control"
            onClick={handleSkip}
            aria-label="Skip to full text"
          >
            ⏭
          </button>
        </div>
        {phase === "intro" && (
          <div className="star-wars-intro" aria-hidden={phase !== "intro"}>
            {introText}
          </div>
        )}

        {phase !== "final" && (
          <div
            className="star-wars-crawl-stage"
            aria-hidden={phase !== "crawl"}
          >
            <div
              className={
                phase === "crawl"
                  ? `star-wars-crawl star-wars-crawl-active ${
                      paused ? "star-wars-crawl-paused" : ""
                    }`
                  : "star-wars-crawl"
              }
              onAnimationEnd={() => setPhase("final")}
              style={
                paused ? { animationPlayState: "paused" as const } : undefined
              }
            >
              <p className="star-wars-episode">{episodeLabel}</p>
              <h2>{title}</h2>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {phase === "final" && (
          <div className="star-wars-final" role="document">
            <h2>{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default StarWarsCrawlOverlay;
