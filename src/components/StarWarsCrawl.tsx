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
const INTRO_DELAY_MS = 1000;
const CRAWL_DURATION_MS = 140_000;
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
  const manualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (phase === "final" && manualRef.current) {
      manualRef.current.focus();
    }
  }, [phase]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!open) {
      setPhase("intro");
      setPaused(false);
      return;
    }

    setPhase("intro");
    setPaused(false);
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

    const timers = timersRef.current;

    if (phase !== "crawl") {
      if (timers.final) {
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
      remainingRef.current = null;
      finalEndRef.current = null;
      setPaused(false);
      return;
    }

    const triggerDelay = Math.max(
      1200,
      CRAWL_DURATION_MS * FINAL_TRIGGER_RATIO
    );
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

  const togglePause = () => {
    if (phase !== "crawl") {
      return;
    }

    const timers = timersRef.current;

    if (!paused) {
      if (timers.final && finalEndRef.current) {
        const remaining = Math.max(0, finalEndRef.current - Date.now());
        remainingRef.current = remaining;
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
      setPaused(true);
      return;
    }

    setPaused(false);
    const remaining = remainingRef.current ?? 0;
    if (remaining > 0) {
      finalEndRef.current = Date.now() + remaining;
      timers.final = window.setTimeout(() => {
        setPhase("final");
        const currentTimers = timersRef.current;
        currentTimers.final = undefined;
        finalEndRef.current = null;
        remainingRef.current = null;
      }, remaining);
      remainingRef.current = null;
    } else {
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
            disabled={phase !== "crawl"}
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
          <div
            className="star-wars-crawl-stage star-wars-crawl-stage-manual"
            aria-hidden={false}
          >
            <div
              className="star-wars-crawl-manual-wrapper"
              ref={manualRef}
              tabIndex={0}
              role="document"
              aria-label={`${title} full story`}
            >
              <span className="star-wars-manual-hint">
                Use scroll or swipe to continue
              </span>
              <p className="star-wars-episode">{episodeLabel}</p>
              <h2>{title}</h2>
              <div className="star-wars-crawl-manual">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default StarWarsCrawlOverlay;
