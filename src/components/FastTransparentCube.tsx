import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const src = "/vendor/animcube/AnimCube3.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        // Only preserve scroll position if this is not the initial page load
        const shouldPreserveScroll = hasInitialized.current;
        const scrollX = shouldPreserveScroll ? window.scrollX : 0;
        const scrollY = shouldPreserveScroll ? window.scrollY : 0;

        // @ts-expect-error AnimCube3 global
        window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");

        // small timeout to allow the script to create nodes, then restore scroll only if needed
        setTimeout(() => {
          if (shouldPreserveScroll) {
            window.scrollTo(scrollX, scrollY);
          }

          // ensure any canvas injected fits the wrapper and doesn't overflow
          const container = document.getElementById("cube-embed");
          if (container) {
            const canvases = container.getElementsByTagName("canvas");
            for (const c of Array.from(canvases)) {
              (c as HTMLCanvasElement).style.maxWidth = "100%";
              (c as HTMLCanvasElement).style.height = "100%";
              (c as HTMLCanvasElement).style.display = "block";
              (c as HTMLCanvasElement).style.boxSizing = "border-box";
            }
          }
        }, 50);
      };
      document.body.appendChild(s);
    } else {
      // preserve and restore scroll when calling init if script already exists
      const shouldPreserveScroll = hasInitialized.current;
      const scrollX = shouldPreserveScroll ? window.scrollX : 0;
      const scrollY = shouldPreserveScroll ? window.scrollY : 0;

      // @ts-expect-error AnimCube3 global
      window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");

      setTimeout(() => {
        if (shouldPreserveScroll) {
          window.scrollTo(scrollX, scrollY);
        }
      }, 50);
    }

    // Mark as initialized after first run
    hasInitialized.current = true;
  }, []);

  // expanded view control
  const [expandedOpen, setExpandedOpen] = useState(false);

  useEffect(() => {
    if (expandedOpen) {
      // initialize expanded container when dialog opens
      setTimeout(() => {
        // if AnimCube3 supports multiple ids, call with new id
        // @ts-expect-error AnimCube3 global
        window.AnimCube3?.("id=cube-embed-expanded&buttonbar=1&speed=10");
      }, 100);

      // Handle ESC key to close overlay
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setExpandedOpen(false);
        }
      };

      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent background scroll

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [expandedOpen]);
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

  const cubeInnerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    touchAction: "none",
  };

  // Render compact cube with optional expand overlay
  return (
    <>
      <div style={wrapperStyle}>
        <div id="cube-embed" style={cubeInnerStyle} />

        {enableExpand && (
          <div style={{ position: "absolute", right: 8, bottom: 8 }}>
            <Button
              size="sm"
              variant="outline"
              className="!p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all"
              onClick={() => setExpandedOpen(true)}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Custom overlay for expanded cube */}
      {expandedOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(20px)",
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={() => setExpandedOpen(false)}
        >
          {/* Close button */}
          <Button
            size="sm"
            variant="outline"
            className="absolute top-6 right-6 z-[101] !p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20"
            onClick={() => setExpandedOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Expanded cube container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90vw",
              height: "90vh",
              maxWidth: "800px",
              maxHeight: "600px",
              animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: "scale(1)",
            }}
          >
            <div
              id="cube-embed-expanded"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              }}
            />
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.3);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
