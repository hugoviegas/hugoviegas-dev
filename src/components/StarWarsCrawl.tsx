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
type PauseReason = "none" | "control" | "interaction";

const EPISODE_FALLBACK = "Episode I";
const INTRO_FALLBACK = "A long time ago in a galaxy far, far away....";
const INTRO_DELAY_MS = 1000;
const CRAWL_DURATION_MS = 140_000;
const FINAL_TRIGGER_RATIO = 0.98;
const OFFSET_MIN = -2600;
const OFFSET_MAX = 2600;
const DRAG_SENSITIVITY = 1;
const WHEEL_SENSITIVITY = 0.6;
const WHEEL_RESUME_DELAY_MS = 360;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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
  const [pauseReasonState, setPauseReasonState] = useState<PauseReason>("none");
  const [manualOffset, setManualOffset] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const paragraphs = useMemo(() => splitStory(story), [story]);

  const closeRef = useRef(onClose);
  const timersRef = useRef<{ intro?: number; final?: number }>({});
  const finalEndRef = useRef<number | null>(null);
  const remainingRef = useRef<number | null>(null);
  const manualRef = useRef<HTMLDivElement | null>(null);
  const pauseReasonRef = useRef<PauseReason>("none");
  const pointerRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastY: number;
  }>({ active: false, pointerId: null, lastY: 0 });
  const wheelTimeoutRef = useRef<number | null>(null);

  const paused = pauseReasonState !== "none";

  const syncPauseReason = (reason: PauseReason) => {
    pauseReasonRef.current = reason;
    setPauseReasonState(reason);
  };

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (phase === "final" && manualRef.current) {
      manualRef.current.focus();
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!open) {
      setPhase("intro");
      syncPauseReason("none");
      setManualOffset(0);
      setIsInteracting(false);
      pointerRef.current = { active: false, pointerId: null, lastY: 0 };
      return;
    }

    setPhase("intro");
    syncPauseReason("none");
    setManualOffset(0);
    setIsInteracting(false);
    pointerRef.current = { active: false, pointerId: null, lastY: 0 };

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
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = null;
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
      if (pauseReasonRef.current !== "none") {
        syncPauseReason("none");
      }
      setManualOffset(0);
      setIsInteracting(false);
      pointerRef.current = { active: false, pointerId: null, lastY: 0 };
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
      syncPauseReason("none");
    }, triggerDelay);

    return () => {
      if (timers.final) {
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
    };
  }, [phase]);

  const beginPause = (reason: PauseReason) => {
    if (reason === "none" || phase !== "crawl") {
      if (reason !== "none") {
        syncPauseReason(reason);
      }
      return;
    }

    if (pauseReasonRef.current === "control" && reason === "interaction") {
      return;
    }

    if (pauseReasonRef.current === reason) {
      return;
    }

    if (pauseReasonRef.current === "none") {
      const timers = timersRef.current;
      if (timers.final && finalEndRef.current) {
        const remaining = Math.max(0, finalEndRef.current - Date.now());
        remainingRef.current = remaining;
        window.clearTimeout(timers.final);
        timers.final = undefined;
      }
    }

    syncPauseReason(reason);
  };

  const resumeCrawl = (force = false) => {
    if (!force && pauseReasonRef.current === "control") {
      return;
    }

    if (phase !== "crawl") {
      syncPauseReason("none");
      return;
    }

    const timers = timersRef.current;
    const remaining = remainingRef.current ?? 0;

    if (remaining > 0) {
      finalEndRef.current = Date.now() + remaining;
      timers.final = window.setTimeout(() => {
        setPhase("final");
        const currentTimers = timersRef.current;
        currentTimers.final = undefined;
        finalEndRef.current = null;
        remainingRef.current = null;
        syncPauseReason("none");
      }, remaining);
      remainingRef.current = null;
    } else if (!timers.final) {
      setPhase("final");
      syncPauseReason("none");
      return;
    }

    syncPauseReason("none");
  };

  const togglePause = () => {
    if (phase !== "crawl") {
      return;
    }

    if (pauseReasonRef.current === "control") {
      resumeCrawl(true);
      return;
    }

    beginPause("control");
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
    if (wheelTimeoutRef.current) {
      window.clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = null;
    }
    finalEndRef.current = null;
    remainingRef.current = null;
    syncPauseReason("none");
    setManualOffset(0);
    setIsInteracting(false);
    pointerRef.current = { active: false, pointerId: null, lastY: 0 };
    setPhase("final");
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "crawl") {
      return;
    }

    pointerRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastY: event.clientY,
    };
    setIsInteracting(true);

    if (pauseReasonRef.current !== "control") {
      beginPause("interaction");
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current.active) {
      return;
    }

    event.preventDefault();
    const delta = (event.clientY - pointerRef.current.lastY) * DRAG_SENSITIVITY;
    pointerRef.current.lastY = event.clientY;
    setManualOffset((prev) => clamp(prev + delta, OFFSET_MIN, OFFSET_MAX));
  };

  const finishPointerInteraction = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (pointerRef.current.pointerId !== null) {
      try {
        event.currentTarget.releasePointerCapture(pointerRef.current.pointerId);
      } catch {
        // ignore release errors when pointer capture is already cleared
      }
    }
    pointerRef.current = { active: false, pointerId: null, lastY: 0 };
    setIsInteracting(false);

    if (pauseReasonRef.current === "interaction") {
      resumeCrawl();
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current.active) {
      return;
    }
    finishPointerInteraction(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current.active) {
      return;
    }
    finishPointerInteraction(event);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (phase !== "crawl") {
      return;
    }

    event.preventDefault();
    setIsInteracting(true);
    setManualOffset((prev) =>
      clamp(prev + event.deltaY * WHEEL_SENSITIVITY, OFFSET_MIN, OFFSET_MAX)
    );

    if (pauseReasonRef.current !== "control") {
      beginPause("interaction");
    }

    if (wheelTimeoutRef.current) {
      window.clearTimeout(wheelTimeoutRef.current);
    }

    wheelTimeoutRef.current = window.setTimeout(() => {
      setIsInteracting(false);
      if (pointerRef.current.active) {
        return;
      }
      if (pauseReasonRef.current === "interaction") {
        resumeCrawl();
      }
    }, WHEEL_RESUME_DELAY_MS);
  };

  if (typeof document === "undefined" || !open) {
    return null;
  }

  const crawlStageClass = [
    "star-wars-crawl-stage",
    phase === "crawl" ? "star-wars-crawl-stage-interactive" : "",
    isInteracting ? "star-wars-crawl-stage-interacting" : "",
  ]
    .filter(Boolean)
    .join(" ");

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
            className={crawlStageClass}
            aria-hidden={phase !== "crawl"}
            style={{ pointerEvents: "auto" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onWheel={handleWheel}
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
              <div
                className={`star-wars-crawl-content${
                  isInteracting ? " star-wars-crawl-content-active" : ""
                }`}
                style={{
                  transform: `translateY(${manualOffset}px)`,
                  transition: isInteracting
                    ? "none"
                    : "transform 180ms ease-out",
                }}
              >
                <p className="star-wars-episode">{episodeLabel}</p>
                <h2>{title}</h2>
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
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
