import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/lightsaber-viewer.css";

// Minimal runtime-checked types for three-like materials and scene traversal
type ColorLike = {
  r?: number;
  g?: number;
  b?: number;
  clone?: () => unknown;
  setRGB?: (r: number, g: number, b: number) => void;
};
interface MaterialLike {
  color?: ColorLike | number[];
  emissive?: { r?: number; g?: number; b?: number } | unknown;
  emissiveIntensity?: number;
  needsUpdate?: boolean;
  [k: string]: unknown;
}
type ThreeScene = { traverse?: (cb: (obj: unknown) => void) => void };

export default function LightsaberViewerMV() {
  const mvRef = useRef<HTMLDivElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskLoopRef = useRef<number | null>(null);

  const [pulseEnabled] = useState<boolean>(true);
  const originalMaterialIntensityRef = useRef<Map<MaterialLike, number>>(
    new Map()
  );
  const [powered, setPowered] = useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [bladeProgress, setBladeProgress] = useState<number>(0);

  // helper: read r,g,b from various color shapes (three.Color-like or array)
  function getRGBFromColor(col: unknown): [number, number, number] {
    if (!col) return [0, 0, 0];
    if (Array.isArray(col)) return [col[0] ?? 0, col[1] ?? 0, col[2] ?? 0];
    if (typeof col === "object" && col !== null) {
      const c = col as Partial<ColorLike> & Record<string, unknown>;
      return [
        typeof c.r === "number" ? c.r : 0,
        typeof c.g === "number" ? c.g : 0,
        typeof c.b === "number" ? c.b : 0,
      ];
    }
    return [0, 0, 0];
  }

  useEffect(() => {
    // Load model-viewer script from CDN if not present
    if (
      !(window as Window & { modelViewerLoaded?: boolean }).modelViewerLoaded
    ) {
      const moduleScript = document.createElement("script");
      moduleScript.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      moduleScript.type = "module";
      moduleScript.async = true;
      moduleScript.onload = () => {
        (window as Window & { modelViewerLoaded?: boolean }).modelViewerLoaded =
          true;
      };
      const legacyScript = document.createElement("script");
      legacyScript.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js";
      legacyScript.noModule = true;
      legacyScript.async = true;
      legacyScript.onload = () => {
        (window as Window & { modelViewerLoaded?: boolean }).modelViewerLoaded =
          true;
      };
      document.head.appendChild(moduleScript);
      document.head.appendChild(legacyScript);
    }
  }, []);

  // Detect model-viewer readiness: listen to the 'load' event and probe for the internal canvas
  useEffect(() => {
    let mounted = true;
    const tryAttach = () => {
      const mvEl = mvRef.current?.querySelector(
        "model-viewer"
      ) as HTMLElement | null;
      if (!mvEl) return;
      const onLoad = () => {
        if (!mounted) return;
        setModelLoaded(true);
      };
      mvEl.addEventListener("load", onLoad as EventListener);

      // quick probe: if model-viewer already rendered a canvas we consider loaded
      try {
        const maybeShadow = (
          mvEl as unknown as { shadowRoot?: ShadowRoot | null }
        ).shadowRoot;
        const maybeCanvas =
          (maybeShadow?.querySelector("canvas") as HTMLCanvasElement | null) ??
          (mvEl.querySelector("canvas") as HTMLCanvasElement | null);
        if (maybeCanvas) setModelLoaded(true);
      } catch (err) {
        // ignore probe errors
      }

      // cleanup function to remove listener
      return () => {
        mounted = false;
        try {
          mvEl.removeEventListener("load", onLoad as EventListener);
        } catch (e) {
          /* noop */
        }
      };
    };

    // attach immediately and also after a short delay in case scripts are still loading
    const cleanup = tryAttach();
    const t = setTimeout(tryAttach, 500);
    return () => {
      if (typeof cleanup === "function") cleanup();
      clearTimeout(t);
    };
  }, [mvRef]);

  // Add click handler for model-viewer
  useEffect(() => {
    const mvEl = mvRef.current?.querySelector(
      "model-viewer"
    ) as HTMLElement | null;
    if (!mvEl || !modelLoaded) return;

    const handleClick = () => {
      if (powered) {
        const c = maskCanvasRef.current;
        if (c) {
          c.classList.remove("pulse");
          c.classList.remove("power-up");
          stopGreenMaskLoop();
        }
        try {
          for (const [
            mat,
            v,
          ] of originalMaterialIntensityRef.current.entries()) {
            mat.emissiveIntensity = v;
            mat.needsUpdate = true;
          }
          originalMaterialIntensityRef.current.clear();
        } catch (err) {
          console.debug("powerOff restore error", err);
        }
        setPowered(false);
      } else {
        startGreenMaskLoop();
        const canvas = maskCanvasRef.current;
        if (canvas) {
          canvas.classList.add("power-up");
        }
        fadeInMask(700).then(() => {
          const c = maskCanvasRef.current;
          if (c && pulseEnabled) {
            c.classList.add("pulse");
          }
          setPowered(true);
        });
      }
    };

    mvEl.addEventListener("click", handleClick);
    return () => mvEl.removeEventListener("click", handleClick);
  }); // Create or start the overlay mask loop that confines glow to the blade.
  function startGreenMaskLoop() {
    // If already running, keep running
    if (maskLoopRef.current) return;

    const container = mvRef.current;
    if (!container) return;

    const mvEl = container.querySelector("model-viewer") as HTMLElement | null;
    if (!mvEl) return;

    // try to find the internal GL canvas used by model-viewer (shadowRoot or light DOM)
    const maybeShadow = (mvEl as unknown as { shadowRoot?: ShadowRoot | null })
      .shadowRoot;
    const webglCanvas =
      (maybeShadow?.querySelector("canvas") as HTMLCanvasElement | null) ??
      (mvEl.querySelector("canvas") as HTMLCanvasElement | null);
    if (!webglCanvas) return;

    // create mask canvas overlay
    let maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) {
      maskCanvas = document.createElement("canvas");
      maskCanvas.className = "lightsaber-mask";
      maskCanvas.style.position = "absolute";
      maskCanvas.style.left = "0";
      maskCanvas.style.top = "0";
      maskCanvas.style.pointerEvents = "none";
      maskCanvas.style.opacity = "0";
      maskCanvas.style.transition =
        "opacity 260ms ease-out, filter 260ms ease-out";
      // insert over the model-viewer element
      const wrapper = mvEl.parentElement ?? mvEl;
      wrapper.style.position = wrapper.style.position || "relative";
      wrapper.appendChild(maskCanvas);
      maskCanvasRef.current = maskCanvas;
    }

    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })!;

    // temporary downscale canvas for processing
    const tmp = document.createElement("canvas");
    const tmpCtx = tmp.getContext("2d", { willReadFrequently: true })!;

    let rafId: number | null = null;

    const SAMPLE_SCALE = 0.45; // downscale to reduce noise and CPU
    const EROSION_ITERS = 2; // helps remove small background speckles

    function update() {
      try {
        const w = webglCanvas.width;
        const h = webglCanvas.height;
        if (!w || !h) {
          rafId = requestAnimationFrame(update);
          return;
        }

        // keep mask canvas full-size and positioned
        if (maskCanvas.width !== w || maskCanvas.height !== h) {
          maskCanvas.width = w;
          maskCanvas.height = h;
          maskCanvas.style.width = `${w}px`;
          maskCanvas.style.height = `${h}px`;
        }

        const sw = Math.max(6, Math.floor(w * SAMPLE_SCALE));
        const sh = Math.max(6, Math.floor(h * SAMPLE_SCALE));
        if (tmp.width !== sw || tmp.height !== sh) {
          tmp.width = sw;
          tmp.height = sh;
        }

        // draw downscaled frame
        tmpCtx.clearRect(0, 0, sw, sh);
        tmpCtx.drawImage(webglCanvas, 0, 0, sw, sh);
        const src = tmpCtx.getImageData(0, 0, sw, sh).data;

        // strict green detection: require green dominant and reasonably bright
        const map = new Uint8Array(sw * sh);
        for (let i = 0; i < sw * sh; i++) {
          const ri = i * 4;
          const r = src[ri] / 255;
          const g = src[ri + 1] / 255;
          const b = src[ri + 2] / 255;
          // stricter thresholds to avoid background greenish areas
          map[i] =
            g > 0.55 && g > r * 1.8 && g > b * 1.8 && g - Math.max(r, b) > 0.15
              ? 1
              : 0;
        }

        // morphological erosion to remove tiny islands
        for (let iter = 0; iter < EROSION_ITERS; iter++) {
          const tmpMap = new Uint8Array(sw * sh);
          for (let y = 1; y < sh - 1; y++) {
            for (let x = 1; x < sw - 1; x++) {
              const idx = y * sw + x;
              if (!map[idx]) continue;
              let keep = 1;
              for (let yy = -1; yy <= 1; yy++) {
                for (let xx = -1; xx <= 1; xx++) {
                  if (xx === 0 && yy === 0) continue;
                  if (!map[(y + yy) * sw + (x + xx)]) {
                    keep = 0;
                    break;
                  }
                }
                if (!keep) break;
              }
              if (keep) tmpMap[idx] = 1;
            }
          }
          map.set(tmpMap);
        }

        // connected components to pick the blade component
        const labels = new Int32Array(sw * sh);
        let labelId = 0;
        const sizes: Record<number, number> = {};
        const minX: Record<number, number> = {};
        const minY: Record<number, number> = {};
        const maxX: Record<number, number> = {};
        const maxY: Record<number, number> = {};
        const stack: number[] = [];
        for (let i = 0; i < sw * sh; i++) {
          if (!map[i] || labels[i] !== 0) continue;
          labelId++;
          labels[i] = labelId;
          minX[labelId] = sw;
          minY[labelId] = sh;
          maxX[labelId] = 0;
          maxY[labelId] = 0;
          let size = 0;
          stack.push(i);
          while (stack.length) {
            const idx = stack.pop()!;
            size++;
            const yy = Math.floor(idx / sw);
            const xx = idx % sw;
            if (xx < minX[labelId]) minX[labelId] = xx;
            if (yy < minY[labelId]) minY[labelId] = yy;
            if (xx > maxX[labelId]) maxX[labelId] = xx;
            if (yy > maxY[labelId]) maxY[labelId] = yy;
            const neigh = [idx - sw, idx + sw, idx - 1, idx + 1];
            for (const n of neigh) {
              if (n < 0 || n >= sw * sh) continue;
              if (labels[n] !== 0) continue;
              if (!map[n]) continue;
              labels[n] = labelId;
              stack.push(n);
            }
          }
          sizes[labelId] = size;
        }

        // pick target: prefer component touching left-middle (hilt) else tall thin component
        let target = 0;
        const probeX = Math.max(0, Math.floor(sw * 0.12));
        const probeY = Math.floor(sh * 0.5);
        const probeIdx = probeY * sw + probeX;
        if (labels[probeIdx] && labels[probeIdx] > 0) target = labels[probeIdx];
        else {
          let best = 0;
          let bestScore = 0;
          for (const idStr in sizes) {
            const id = Number(idStr);
            const wbox = maxX[id] - minX[id] + 1;
            const hbox = maxY[id] - minY[id] + 1;
            const aspect = hbox > 0 ? hbox / wbox : 0; // tall component -> larger aspect
            const score = aspect * Math.log(1 + sizes[id]);
            if (score > bestScore) {
              bestScore = score;
              best = id;
            }
          }
          if (best > 0) target = best;
          else {
            // fallback to largest
            let maxSize = 0;
            for (const idStr in sizes) {
              const id = Number(idStr);
              if (sizes[id] > maxSize) {
                maxSize = sizes[id];
                target = id;
              }
            }
          }
        }

        // produce outline image for the target component (downscale)
        const outImg = tmpCtx.createImageData(sw, sh);
        const out = outImg.data;
        if (target > 0) {
          for (let y = 1; y < sh - 1; y++) {
            for (let x = 1; x < sw - 1; x++) {
              const idx = y * sw + x;
              if (labels[idx] !== target) continue;
              const up = labels[idx - sw];
              const down = labels[idx + sw];
              const left = labels[idx - 1];
              const right = labels[idx + 1];
              if (up && down && left && right) continue; // interior
              const o = idx * 4;
              out[o] = 24;
              out[o + 1] = 255;
              out[o + 2] = 96;
              out[o + 3] = 255;
            }
          }
        }

        // small 1-px dilation to thicken outline a little
        const dil = new Uint8ClampedArray(out);
        for (let y = 1; y < sh - 1; y++) {
          for (let x = 1; x < sw - 1; x++) {
            const idx = y * sw + x;
            const o = idx * 4;
            if (out[o + 3] === 255) continue;
            const neighbors = [
              ((y - 1) * sw + x) * 4,
              ((y + 1) * sw + x) * 4,
              (y * sw + (x - 1)) * 4,
              (y * sw + (x + 1)) * 4,
            ];
            for (const n of neighbors) {
              if (out[n + 3] === 255) {
                dil[o] = out[n];
                dil[o + 1] = out[n + 1];
                dil[o + 2] = out[n + 2];
                dil[o + 3] = 300;
                break;
              }
            }
          }
        }
        outImg.data.set(dil);

        // draw outline and upscale with a tightly clamped blur
        tmpCtx.putImageData(outImg, 0, 0);
        maskCtx.clearRect(0, 0, w, h);

        // compute blur relative to blade width but keep it small; increase by 10%
        let blurPx = 6;
        if (target > 0) {
          const compWsmall = maxX[target] - minX[target] + 1;
          const compWfull = Math.max(3, Math.round(compWsmall * (w / sw)));
          // base fraction (2% of blade width) then scale up slightly (~3%), clamp to [2,12]
          const base = Math.round(compWfull * 0.02 * 1.03);
          blurPx = Math.max(2, Math.min(base, 12));
        }

        maskCtx.save();
        maskCtx.filter = `blur(${blurPx}px)`;
        maskCtx.drawImage(tmp, 0, 0, sw, sh, 0, 0, w, h);
        maskCtx.restore();

        // confine glow strictly to the target component with blade progress
        if (target > 0) {
          const maskData = maskCtx.createImageData(sw, sh);
          const md = maskData.data;
          const progressX = Math.floor(sw * bladeProgress);
          for (let i = 0; i < sw * sh; i++) {
            const x = i % sw;
            const isTarget = labels[i] === target;
            const isVisible = bladeProgress >= 1 || x <= progressX;
            const a = isTarget && isVisible ? 255 : 0;
            md[i * 4] = 0;
            md[i * 4 + 1] = 0;
            md[i * 4 + 2] = 0;
            md[i * 4 + 3] = a;
          }
          // draw mask upscaled and use destination-in to clip the blur
          const maskSmall = document.createElement("canvas");
          maskSmall.width = sw;
          maskSmall.height = sh;
          const mctx = maskSmall.getContext("2d")!;
          mctx.putImageData(maskData, 0, 0);
          maskCtx.globalCompositeOperation = "destination-in";
          maskCtx.drawImage(maskSmall, 0, 0, sw, sh, 0, 0, w, h);
          maskCtx.globalCompositeOperation = "source-in";
          // restore to the original saturated green (slightly more conservative)
          maskCtx.fillStyle = "rgba(40,240,110,1)";
          maskCtx.fillRect(0, 0, w, h);
          maskCtx.globalCompositeOperation = "source-over";
        } else {
          // no confident component — be conservative: clear glow
          maskCtx.clearRect(0, 0, w, h);
        }
      } catch (err) {
        // ignore per-frame issues but keep a lightweight debug log
        // console.debug('mask loop error', err);
      }
      rafId = requestAnimationFrame(update);
      maskLoopRef.current = rafId;
    }

    // start loop
    rafId = requestAnimationFrame(update);
    maskLoopRef.current = rafId;
  }

  function stopGreenMaskLoop() {
    if (maskLoopRef.current) {
      cancelAnimationFrame(maskLoopRef.current);
      maskLoopRef.current = null;
    }
    if (maskCanvasRef.current) {
      maskCanvasRef.current.remove();
      maskCanvasRef.current = null;
    }
  }

  // Animate mask canvas opacity and blade progress from left to right
  function fadeInMask(duration: number) {
    return new Promise<void>((resolve) => {
      const canvas = maskCanvasRef.current;
      if (!canvas) {
        resolve();
        return;
      }
      const start = performance.now();
      const startFilter = 24;
      const endFilter = 8;
      function frame(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        canvas.style.opacity = String(ease);
        const blur = Math.round(startFilter + (endFilter - startFilter) * ease);
        canvas.style.filter = `blur(${blur}px) saturate(1.1)`;

        // Animate blade progress from left to right
        setBladeProgress(ease);

        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  // This function is now inlined in the click handler above
  // Keeping as a reference for any external calls if needed

  const powerOff = useCallback(() => {
    const c = maskCanvasRef.current;
    if (c) {
      c.classList.remove("pulse");
      c.classList.remove("power-up");

      // Animate blade disappearing from right to left
      const start = performance.now();
      const duration = 400;
      function animate(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const progress = 1 - t; // Reverse direction
        setBladeProgress(progress);

        c.style.opacity = String(progress);
        c.style.filter = `blur(${20 + (1 - progress) * 10}px)`;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => stopGreenMaskLoop(), 50);
        }
      }
      requestAnimationFrame(animate);
    }
    try {
      for (const [mat, v] of originalMaterialIntensityRef.current.entries()) {
        try {
          mat.emissiveIntensity = v;
          mat.needsUpdate = true;
        } catch (err) {
          console.debug("restore mat error", err);
        }
      }
      originalMaterialIntensityRef.current.clear();
    } catch (err) {
      console.debug("powerOff restore error", err);
    }
    setPowered(false);
  }, []);

  // Material animation (best-effort when scene is available)
  function performPowerOnAnimation(
    scene: ThreeScene,
    duration: number,
    targetIntensity: number
  ) {
    const greenMaterials: MaterialLike[] = [];
    const allMaterials: {
      mat: MaterialLike;
      color: [number, number, number];
      name?: string;
    }[] = [];
    try {
      scene.traverse!((obj: unknown) => {
        const node = obj as { material?: unknown; name?: string } | null;
        if (!node || typeof node.material === "undefined") return;
        const mat = node.material as MaterialLike;
        const col = mat.color;
        if (!col) return;
        const [r, g, b] = getRGBFromColor(col);
        allMaterials.push({ mat, color: [r, g, b], name: node.name });
        const isGreenByColor = g > 0.25 && g > r * 1.4 && g > b * 1.4;
        const isGreenByName = !!(
          node.name &&
          (node.name.toLowerCase().includes("blade") ||
            node.name.toLowerCase().includes("green") ||
            node.name.toLowerCase().includes("saber"))
        );
        if (isGreenByColor || isGreenByName) greenMaterials.push(mat);
      });
    } catch (err) {
      console.debug("scene traverse error", err);
    }

    if (greenMaterials.length === 0) {
      // fallback: any bright material
      for (const { mat, color } of allMaterials) {
        const [r, g, b] = color;
        if (r > 0.2 || g > 0.2 || b > 0.2) greenMaterials.push(mat);
      }
    }
    if (greenMaterials.length === 0) return;

    const start = performance.now();
    const initial = greenMaterials.map((m) => ({
      v:
        typeof m.emissiveIntensity === "number"
          ? (m.emissiveIntensity as number)
          : 0,
    }));
    (function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      greenMaterials.forEach((mat, i) => {
        try {
          const init = initial[i].v;
          if (!mat.emissive) mat.emissive = { r: 0.2, g: 0.8, b: 0.2 };
          mat.emissiveIntensity = init + (targetIntensity - init) * ease;
          mat.needsUpdate = true;
        } catch (err) {
          console.debug("material animate error", err);
        }
      });
      if (t < 1) requestAnimationFrame(step);
      else setPowered(true);
    })(performance.now());
  }

  return (
    <div className="min-h-screen p-6">
      <nav className="mb-4">
        <Link to="/" className="text-sm text-blue-400">
          ← Home
        </Link>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Lightsaber Viewer</h1>

      <p className="text-sm text-gray-400 mb-4">
        {modelLoaded
          ? "Click on the lightsaber to power on/off"
          : "Loading model..."}
      </p>

      <div
        ref={mvRef}
        className="lightsaber-container"
        style={{ position: "relative" }}
      >
        <div
          className="lightsaber-scene"
          style={{ width: "100%", height: "640px" }}
        >
          <model-viewer
            interaction-prompt="none"
            src="/3d-model/Star Wars - Lightsabers.glb"
            alt="Lightsaber"
            disable-zoom
            min-camera-orbit="0deg 75deg auto"
            max-camera-orbit="0deg 75deg auto"
            camera-orbit="0deg 75deg auto"
            exposure="1"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              cursor: powered ? "pointer" : modelLoaded ? "pointer" : "default",
            }}
          ></model-viewer>
        </div>
      </div>
    </div>
  );
}
