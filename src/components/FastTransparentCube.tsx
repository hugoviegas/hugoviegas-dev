import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    AnimCube3?: (params?: string) => void;
    acjs_move?: unknown[];
    acjs_getMove?: unknown;
    acjs_startAnimation?: unknown;
    acjs_doMove?: unknown;
    acjs_put_var?: unknown;
    acjs_clear?: unknown;
  }
}
import { Button } from "@/components/ui/button";
import { X, Maximize } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function FastTransparentCube({
  width = 250,
  height = 250,
  enableExpand = false,
}: {
  width?: number;
  height?: number;
  enableExpand?: boolean;
}) {
  const { t } = useLanguage();
  const hasInitialized = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);

  const [expandedOpen, setExpandedOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Inicializar AnimCube3 apenas uma vez - um único cubo
  useEffect(() => {
    const src = "/vendor/animcube/AnimCube3.js";

    // Prepare direct-access arrays so AnimCube3 will expose internal vars/functions
    // when it initializes (init_direct_access looks for window.acjs_<name> arrays).
    // Create them before the script is appended so init_direct_access can populate them.
    try {
      window.acjs_move = window.acjs_move || [];
      // AnimCube direct-access placeholders
      window.acjs_getMove = window.acjs_getMove || [];
      // AnimCube direct-access placeholders
      window.acjs_startAnimation = window.acjs_startAnimation || [];
      // optional useful handles
      // AnimCube direct-access placeholders
      window.acjs_doMove = window.acjs_doMove || [];
      // AnimCube direct-access placeholders
      window.acjs_put_var = window.acjs_put_var || [];
      window.acjs_clear = window.acjs_clear || [];
    } catch (e) {
      // ignore in non-browser environments
    }

    const initCube = () => {
      const shouldPreserveScroll = hasInitialized.current;
      const scrollX = shouldPreserveScroll ? window.scrollX : 0;
      const scrollY = shouldPreserveScroll ? window.scrollY : 0;

      // AnimCube3 global
      window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");

      setTimeout(() => {
        if (shouldPreserveScroll) {
          window.scrollTo(scrollX, scrollY);
        }

        // Configurar canvas uma única vez
        const container = document.getElementById("cube-embed");
        if (container) {
          const canvases = container.getElementsByTagName("canvas");
          for (const c of Array.from(canvases)) {
            (c as HTMLCanvasElement).style.maxWidth = "100%";
            (c as HTMLCanvasElement).style.height = "100%";
            (c as HTMLCanvasElement).style.display = "block";
            (c as HTMLCanvasElement).style.boxSizing = "border-box";
            (c as HTMLCanvasElement).style.animation =
              "cubeFloat 6s ease-in-out infinite";
          }
        }
      }, 50);

      hasInitialized.current = true;
    };

    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = initCube;
      document.body.appendChild(s);
      // AnimCube3 global check
    } else if (window.AnimCube3) {
      setTimeout(initCube, 100);
    }
  }, []); // Executar apenas uma vez!

  // FLIP Animation Functions
  const flipToExpanded = useCallback(() => {
    // overlayRef is not expected to exist before we setExpandedOpen(true)
    if (isAnimating || !cubeRef.current) return;

    setIsAnimating(true);
    document.body.style.overflow = "hidden";

    // FIRST: Capturar posição e tamanho inicial
    const first = cubeRef.current.getBoundingClientRect();

    // Mostrar overlay para calcular posição final
    setExpandedOpen(true);

    // Aguardar DOM update
    requestAnimationFrame(() => {
      if (!overlayRef.current || !cubeRef.current) return;

      // LAST: Mover cubo para o overlay e capturar posição final
      const expandedContainer = overlayRef.current.querySelector(
        ".cube-target"
      ) as HTMLElement;
      if (expandedContainer) {
        expandedContainer.appendChild(cubeRef.current);
        const last = cubeRef.current.getBoundingClientRect();

        // INVERT: Calcular delta e aplicar transform inicial
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        const deltaW = first.width / last.width;
        const deltaH = first.height / last.height;

        cubeRef.current.style.transformOrigin = "top left";
        cubeRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

        // PLAY: Animar para posição final
        const animation = cubeRef.current.animate(
          [
            {
              transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
            },
            {
              transform: "none",
            },
          ],
          {
            duration: 400,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards",
          }
        );
        animationRef.current = animation;

        const onFinish = () => {
          if (cubeRef.current) {
            cubeRef.current.style.transform = "none";
            cubeRef.current.style.transformOrigin = "";
          }
          setIsAnimating(false);
          // Force a resize event so AnimCube3 can recalc canvas sizes in expanded mode
          setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
          animation.removeEventListener("finish", onFinish);
        };

        animation.addEventListener("finish", onFinish);
      }
    });
  }, [isAnimating]);

  const flipToOriginal = useCallback(() => {
    if (isAnimating || !cubeRef.current || !wrapperRef.current) return;

    setIsAnimating(true);

    // FIRST: Capturar posição atual (expandida)
    const first = cubeRef.current.getBoundingClientRect();

    // LAST: Mover cubo de volta ao wrapper original
    wrapperRef.current.appendChild(cubeRef.current);
    const last = cubeRef.current.getBoundingClientRect();

    // INVERT: Calcular delta
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;

    cubeRef.current.style.transformOrigin = "top left";
    cubeRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

    // PLAY: Animar de volta
    const animation = cubeRef.current.animate(
      [
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
        },
        {
          transform: "none",
        },
      ],
      {
        duration: 400,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
      }
    );

    animationRef.current = animation;

    const onFinishBack = () => {
      if (cubeRef.current) {
        cubeRef.current.style.transform = "none";
        cubeRef.current.style.transformOrigin = "";
      }
      setExpandedOpen(false);
      document.body.style.overflow = "unset";
      setIsAnimating(false);
      // Give AnimCube3 a moment to remeasure
      setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      animation.removeEventListener("finish", onFinishBack);
    };

    animation.addEventListener("finish", onFinishBack);
  }, [isAnimating]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedOpen && !isAnimating) {
        flipToOriginal();
      }
    };

    if (expandedOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedOpen, isAnimating, flipToOriginal]);

  // Play a predefined move sequence on the existing AnimCube instance
  const playSequence = useCallback((seq = "R U R' U'") => {
    if (!cubeRef.current) return;

    try {
      // Preferred: use direct AnimCube3 functions if exposed
      if (
        typeof window.acjs_put_var !== "undefined" &&
        typeof window.acjs_getMove !== "undefined"
      ) {
        // Some animcube builds expose acjs_* arrays via init_direct_access
        try {
          // Try to set the move parameter and start animation via exposed helpers
          const id = cubeRef.current.id || "cube-embed";
          // Put move param and start animation if function exists
          if (
            window.acjs_put_var &&
            typeof window.acjs_put_var === "function"
          ) {
            window.acjs_put_var("move", seq, "s");
          }
        } catch (e) {
          // ignore and fallback
        }
      }

      // Fallback: call AnimCube3 init with move parameter on the existing container
      // This may reinitialize the instance but often triggers the move playback.
      if (window.AnimCube3 && typeof window.AnimCube3 === "function") {
        try {
          window.AnimCube3(
            `id=${cubeRef.current.id}&move=${encodeURIComponent(seq)}`
          );
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      // no-op on error
      console.warn("playSequence failed", err);
    }
  }, []);

  const wrapperStyle = {
    width: "100%",
    maxWidth: `${width}px`,
    height: `${enableExpand ? height + 56 : height}px`,
    overflow: "visible",
    background: "transparent",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: enableExpand ? 12 : 0,
    position: "relative" as const,
  };

  return (
    <>
      <div ref={wrapperRef} style={wrapperStyle}>
        {/* UM ÚNICO CUBO - sempre aqui inicialmente */}
        <div
          ref={cubeRef}
          id="cube-embed"
          style={{
            width: "100%",
            height: expandedOpen ? "100%" : `${height}px`,
            borderRadius: 12,
            overflow: "hidden",
            touchAction: "none",
          }}
        />

        {enableExpand && !isAnimating && (
          <Button
            size="icon"
            variant="outline"
            aria-label={t("expandCube")}
            className="h-11 w-11 rounded-full border-border bg-card/70 backdrop-blur-sm hover:bg-accent/20 transition-colors"
            onClick={flipToExpanded}
            style={{ zIndex: 91, touchAction: "manipulation" }}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* OVERLAY: Target para o cubo se mover */}
      {expandedOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={overlayRef}
              className="fixed inset-0 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(20px)",
                animation: "fadeIn 0.3s ease-out",
                padding: 20,
                zIndex: 9999999,
              }}
              onClick={!isAnimating ? flipToOriginal : undefined}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 101,
                  display: "flex",
                  gap: 8,
                }}
              >
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={t("closeCube")}
                  className="h-11 w-11 rounded-full border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  onClick={!isAnimating ? flipToOriginal : undefined}
                >
                  <X className="w-6 h-6" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11 rounded-full border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
                  onClick={() => playSequence("R U R' U'")}
                  disabled={isAnimating}
                  aria-label={t("playCubeMoves")}
                >
                  ▶
                </Button>
              </div>

              <div
                className="cube-target"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "95vw",
                  height: "95vh",
                  maxWidth: "1100px",
                  maxHeight: "900px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.9)",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* O cubo será movido para cá via FLIP */}
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                Pressione ESC ou clique no X para fechar
              </div>
            </div>,
            document.body
          )
        : null}

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(20px);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes cubeFloat {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
            filter: brightness(1);
          }
          25% { 
            transform: translateY(-4px) rotateX(1deg) rotateY(1deg);
            filter: brightness(1.05);
          }
          50% { 
            transform: translateY(0px) rotateX(0deg) rotateY(2deg);
            filter: brightness(1.1);
          }
          75% { 
            transform: translateY(4px) rotateX(-1deg) rotateY(1deg);
            filter: brightness(1.05);
          }
        }
        
        #cube-embed:hover canvas,
        #cube-embed-expanded:hover canvas {
          animation-play-state: paused;
          filter: brightness(1.2);
          transition: filter 0.2s ease;
        }
        
        #cube-embed canvas,
        #cube-embed-expanded canvas {
          transition: filter 0.3s ease, transform 0.2s ease;
          cursor: grab;
        }
        
        #cube-embed canvas:active,
        #cube-embed-expanded canvas:active {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}
