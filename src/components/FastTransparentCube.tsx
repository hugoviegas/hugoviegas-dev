import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Maximize } from "lucide-react";

export default function FastTransparentCube({
  width = 250,
  height = 250,
  enableExpand = false,
}: {
  width?: number;
  height?: number;
  enableExpand?: boolean;
}) {
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

    const initCube = () => {
      const shouldPreserveScroll = hasInitialized.current;
      const scrollX = shouldPreserveScroll ? window.scrollX : 0;
      const scrollY = shouldPreserveScroll ? window.scrollY : 0;

      // @ts-expect-error AnimCube3 global
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
      // @ts-expect-error AnimCube3 global check
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

  const wrapperStyle = {
    width: "100%",
    maxWidth: `${width}px`,
    height: `${height}px`,
    overflow: "hidden",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
            height: "100%",
            borderRadius: 12,
            overflow: "hidden",
            touchAction: "none",
          }}
        />

        {enableExpand && !isAnimating && (
          <div
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              zIndex: 90,
              pointerEvents: "auto" as const,
            }}
          >
            <Button
              size="sm"
              variant="outline"
              className="!p-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all"
              onClick={flipToExpanded}
              style={{ zIndex: 91, touchAction: "manipulation" }}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* OVERLAY: Target para o cubo se mover */}
      {expandedOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(20px)",
            animation: "fadeIn 0.3s ease-out",
            padding: 20,
          }}
          onClick={!isAnimating ? flipToOriginal : undefined}
        >
          <Button
            size="sm"
            variant="outline"
            className="absolute top-6 right-6 z-[101] !p-3 backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/30"
            onClick={!isAnimating ? flipToOriginal : undefined}
          >
            <X className="w-6 h-6 text-white" />
          </Button>

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
        </div>
      )}

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
