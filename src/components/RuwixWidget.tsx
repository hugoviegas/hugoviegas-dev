import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    RoofPig?: { refreshAll: () => void };
  }
}

type Props = {
  width?: number;
  height?: number;
  initialSolved?: boolean;
  showAlg?: boolean;
};

const JQ_URL =
  "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
const RPIG_URL = "https://ruwix.com/js/roofpig_and_three_transparent.min.js";

const SCRAMBLE = "R U R' U' R U2 R' F R U R' U' F'";
const SOLUTION = "R U R' U' R U2 R'";

export default function RuwixWidget({
  width = 250,
  height = 250,
  initialSolved = false,
  showAlg = true,
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const [fallbackToIframe, setFallbackToIframe] = useState(false);

  /* 1. cria helper síncrono que injeta script e devolve
        uma Promise resolvida no onload  */
  function loadScript(src: string) {
    return new Promise<void>((ok) => {
      if (document.querySelector(`script[src="${src}"]`)) return ok();
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // força ordem: jQuery → Roofpig
      s.onload = () => ok();
      document.body.appendChild(s);
    });
  }

  /* 2. depois de montar o <div class="roofpig">,
        carrega jQuery → Roofpig → chama refreshAll   */
  useEffect(() => {
    (async () => {
      try {
        await loadScript(JQ_URL);
        await loadScript(RPIG_URL);
        window.RoofPig?.refreshAll?.();

        // Wait a bit more for DOM to be ready, then refresh
        setTimeout(() => {
          try {
            window.RoofPig?.refreshAll();
            console.log("RoofPig refreshAll called", window.RoofPig);

            // After RoofPig processes, try to make canvas/background transparent
            setTimeout(() => {
              try {
                const container = divRef.current;
                if (container) {
                  // remove background styles from children
                  container.querySelectorAll<HTMLElement>("*").forEach((el) => {
                    el.style.background = "transparent";
                    el.style.backgroundColor = "transparent";
                    el.style.backgroundImage = "none";
                  });

                  const canvas =
                    container.querySelector<HTMLCanvasElement>("canvas");
                  if (canvas) {
                    canvas.style.background = "transparent";
                    canvas.style.backgroundColor = "transparent";
                    // try to force transparent drawing buffer if possible
                    try {
                      const gl = (canvas.getContext("webgl") ||
                        canvas.getContext(
                          "experimental-webgl"
                        )) as WebGLRenderingContext | null;
                      if (gl) {
                        // set clear color alpha to 0 (may not affect if context was created without alpha)
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                      }
                    } catch (e) {
                      // ignore WebGL errors
                    }
                  }
                }
              } catch (e) {
                console.warn("Failed to force transparent backgrounds:", e);
              }

              // Check if widget actually rendered after 4 seconds
              const canvas = divRef.current?.querySelector("canvas");
              const hasContent = divRef.current?.children.length > 1; // more than just loading div
              if (!canvas && !hasContent) {
                console.warn(
                  "No canvas or content found, falling back to iframe"
                );
                setFallbackToIframe(true);
              } else {
                console.log("RoofPig widget loaded successfully");
              }
            }, 4000);
          } catch (e) {
            console.error("Error calling RoofPig.refreshAll:", e);
            setTimeout(() => setFallbackToIframe(true), 1000);
          }
        }, 200);
      } catch (e) {
        console.error("Failed to load scripts:", e);
        setFallbackToIframe(true);
      }
    })();
  }, []);

  /* 3. monta data-config com setup + alg + flags */
  const flags: string[] = [];
  if (showAlg) flags.push("showalg");
  // request canvas rendering mode which may support transparency
  flags.push("canvas");
  if (initialSolved) flags.push("startsolved");

  const config = [
    "view=play",
    "hover=near",
    "speed=400",
    initialSolved
      ? `alg=${SOLUTION}`
      : [`setup=${SCRAMBLE}`, `alg=${SOLUTION}`].join("|"),
    flags.length ? `flags=${flags.join(" ")}` : null,
  ]
    .filter(Boolean)
    .join("|");

  // Iframe fallback
  if (fallbackToIframe) {
    // Use a simple iframe URL that works reliably
    const iframeSrc = `https://ruwix.com/widget/3d/`;
    return (
      <div className="flex flex-col items-center">
        <iframe
          width={width}
          height={height}
          className="rounded-xl shadow-2xl"
          style={{
            border: 0,
            background: "transparent",
            backgroundColor: "transparent",
          }}
          src={iframeSrc}
          scrolling="no"
          frameBorder="0"
          title="Rubik's Cube Widget (iframe fallback)"
        />
        <div className="text-xs text-gray-500 mt-2">Simple cube widget</div>
      </div>
    );
  }

  return (
    <div
      ref={divRef}
      className="roofpig rounded-xl overflow-hidden shadow-2xl"
      style={{
        width,
        height,
        minHeight: height,
        display: "block",
        position: "relative",
        background: "transparent",
      }}
      data-config={config}
      aria-label="Ruwix 3-D Rubik's Cube Widget"
    >
      {/* Fallback content while widget loads */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-transparent"
        style={{ pointerEvents: "none" }}
      >
        Loading cube...
      </div>
    </div>
  );
}
