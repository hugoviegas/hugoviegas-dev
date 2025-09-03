import { useEffect } from "react";

export default function FastTransparentCube({
  width = 250,
  height = 250,
}: {
  width?: number;
  height?: number;
}) {
  useEffect(() => {
    const src = "/vendor/animcube/AnimCube3.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        // preserve scroll position to avoid AnimCube3 auto-scrolling the page
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // @ts-expect-error AnimCube3 is a global injected by the vendor script
        window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");

        // small timeout to allow the script to create nodes, then restore scroll
        setTimeout(() => {
          window.scrollTo(scrollX, scrollY);

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
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // @ts-expect-error AnimCube3 may be present as a global
      window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");

      setTimeout(() => {
        window.scrollTo(scrollX, scrollY);
      }, 50);
    }
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
