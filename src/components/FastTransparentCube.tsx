import { useEffect, useRef } from "react";

export default function FastTransparentCube({
  width = 250,
  height = 250,
}: {
  width?: number;
  height?: number;
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

        // @ts-expect-error AnimCube3 is a global injected by the vendor script
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

      // @ts-expect-error AnimCube3 may be present as a global
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

  return (
    // wrapper: invisible, constrains size to fit the session and hides overflow
    <div
      role="presentation"
      style={{
        width: "100%",
        maxWidth: `${width}px`, // explicit px to avoid CSS quirks
        height: `${height}px`,
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* inner div is the target for AnimCube3; make it fill the wrapper and prevent overflow */}
      <div
        id="cube-embed"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
          touchAction: "none",
        }}
      />
    </div>
  );
}
