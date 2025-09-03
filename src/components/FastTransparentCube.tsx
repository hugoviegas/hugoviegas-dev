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
        // @ts-expect-error AnimCube3 is a global injected by the vendor script
        window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");
      };
      document.body.appendChild(s);
    } else {
      // @ts-expect-error AnimCube3 may be present as a global
      window.AnimCube3?.("id=cube-embed&buttonbar=0&speed=10");
    }
  }, []);

  return (
    // wrapper: invisible, constrains size to fit the session and hides overflow
    <div
      role="presentation"
      style={{
        width: "100%",
        maxWidth: width, // numeric -> px
        height,
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* inner div is the target for AnimCube3; make it fill the wrapper */}
      <div
        id="cube-embed"
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      />
    </div>
  );
}
