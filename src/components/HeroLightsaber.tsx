import React, { useEffect, useRef, useState } from "react";
import { Box3, Vector3, Object3D } from "three";

interface HeroLightsaberProps {
  className?: string;
}

const HeroLightsaber: React.FC<HeroLightsaberProps> = ({ className = "" }) => {
  const mvRef = useRef<HTMLDivElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [powered, setPowered] = useState<boolean>(false);
  const [powering, setPowering] = useState<boolean>(false);

  useEffect(() => {
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
      return () => {
        mounted = false;
        try {
          mvEl.removeEventListener("load", onLoad as EventListener);
        } catch (e) {
          /* noop */
        }
      };
    };
    const cleanup = tryAttach();
    const t = setTimeout(tryAttach, 500);
    return () => {
      if (typeof cleanup === "function") cleanup();
      clearTimeout(t);
    };
  }, [mvRef]);

  const togglePower = () => {
    if (!powered) {
      setPowering(true);
      setPowered(true);
      window.setTimeout(() => setPowering(false), 900);
    } else {
      setPowered(false);
      setPowering(false);
    }
  };

  useEffect(() => {
    try {
      const mvEl = mvRef.current?.querySelector("model-viewer") as
        | unknown
        | null;
      if (!mvEl) return;
      // narrow types at runtime — model-viewer implementations vary
      const mvObj = mvEl as unknown as Record<string, unknown>;
      const maybeModelObj = (mvObj["model"] ?? mvObj["gltf"]) as unknown | null;
      let scene: unknown = null;
      if (maybeModelObj && typeof maybeModelObj === "object") {
        const mm = maybeModelObj as Record<string, unknown>;
        scene = "scene" in mm ? mm["scene"] ?? maybeModelObj : maybeModelObj;
      }
      if (!scene) return;

      // traverse nodes conservatively (three.js-like traverse or a simple object)
      if (typeof scene === "object" && scene !== null) {
        const sceneRec = scene as Record<string, unknown>;
        const traverseCandidate = sceneRec["traverse"];
        type TraverseFn = (cb: (node: unknown) => void) => void;
        if (typeof traverseCandidate === "function") {
          const traverse = traverseCandidate as TraverseFn;
          try {
            traverse((node: unknown) => {
              if (!node || typeof node !== "object") return;
              const nodeRec = node as Record<string, unknown>;
              const material = nodeRec["material"] as
                | Record<string, unknown>
                | undefined;
              if (!material) return;
              try {
                const emissive = material["emissive"];
                const emissiveIntensity = (
                  material as { emissiveIntensity?: number }
                ).emissiveIntensity;
                if (powered) {
                  if (
                    emissive &&
                    typeof emissive === "object" &&
                    typeof (emissive as Record<string, unknown>)["set"] ===
                      "function"
                  ) {
                    (emissive as { set: (v: number) => void }).set(0x50ff8c);
                  }
                  if (typeof emissiveIntensity !== "undefined") {
                    (
                      material as { emissiveIntensity?: number }
                    ).emissiveIntensity = 1.2;
                  }
                } else {
                  if (typeof emissiveIntensity !== "undefined") {
                    (
                      material as { emissiveIntensity?: number }
                    ).emissiveIntensity = 0;
                  }
                }
              } catch (e) {
                // ignore per-node errors
              }
            });
          } catch (e) {
            // ignore traverse errors
          }
        }
      }
    } catch (e) {
      // ignore global errors
    }
  }, [powered]);

  // DEBUG: log sizes, bounding box and camera info; enable zoom control tuning
  useEffect(() => {
    const mvEl = mvRef.current?.querySelector("model-viewer");
    if (!mvEl) return;

    const mvObj = mvEl as unknown as Record<string, unknown>;

    const logState = (note?: string) => {
      try {
        const rect = (mvEl as Element).getBoundingClientRect();
        const shadowRoot = (
          mvEl as unknown as { shadowRoot?: ShadowRoot | null }
        ).shadowRoot;
        const canvas =
          (shadowRoot?.querySelector("canvas") as HTMLCanvasElement | null) ??
          (mvEl as Element).querySelector("canvas");

        console.log("DEBUG Lightsaber -", note ?? "");
        console.log("element rect", {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        });
        if (canvas) {
          console.log("canvas size", {
            width: canvas.width,
            height: canvas.height,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
          });
        } else {
          console.log("canvas not found yet");
        }

        // attempt to get scene and bounding box
        const maybeModelObj = (mvObj["model"] ?? mvObj["gltf"]) as
          | unknown
          | null;
        let scene: unknown = null;
        if (maybeModelObj && typeof maybeModelObj === "object") {
          const mm = maybeModelObj as Record<string, unknown>;
          scene = (
            "scene" in mm ? mm["scene"] ?? maybeModelObj : maybeModelObj
          ) as unknown;
        }

        if (scene && typeof scene === "object") {
          try {
            const sceneObj = scene as Object3D;
            const box = new Box3();
            box.setFromObject(sceneObj);
            const size = new Vector3();
            const center = new Vector3();
            box.getSize(size);
            box.getCenter(center);
            console.log("model bbox", {
              min: box.min.toArray(),
              max: box.max.toArray(),
              size: size.toArray(),
              center: center.toArray(),
            });
          } catch (e) {
            console.log("bbox compute failed", e);
          }
        } else {
          console.log("scene not found for bbox");
        }

        // camera orbit info
        const getCameraOrbitCandidate = mvObj["getCameraOrbit"];
        if (typeof getCameraOrbitCandidate === "function") {
          type GetCameraOrbitFn = () => string;
          try {
            const fn = getCameraOrbitCandidate as GetCameraOrbitFn;
            const orbit = fn.call(mvEl) as string;
            console.log("camera orbit (getCameraOrbit)", orbit);
          } catch (e) {
            console.log("getCameraOrbit failed", e);
          }
        } else {
          const orbitAttr =
            mvObj["cameraOrbit"] ??
            (mvEl as Element).getAttribute?.("camera-orbit");
          console.log("camera orbit (attr)", orbitAttr);
        }
      } catch (err) {
        console.log("DEBUG logState error", err);
      }
    };

    const onLoad = () => logState("onLoad");
    const onCameraChange = () => logState("camera-change");

    try {
      (mvEl as Element).addEventListener("load", onLoad as EventListener);
      (mvEl as Element).addEventListener(
        "camera-change",
        onCameraChange as EventListener
      );
    } catch (e) {
      /* noop */
    }

    // initial
    setTimeout(() => logState("initial"), 200);

    return () => {
      try {
        (mvEl as Element).removeEventListener("load", onLoad as EventListener);
        (mvEl as Element).removeEventListener(
          "camera-change",
          onCameraChange as EventListener
        );
      } catch (e) {
        /* noop */
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mvRef}
        className="relative overflow-visible"
        onClick={togglePower}
        role="button"
        aria-pressed={powered}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePower();
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`hero-lightsaber-glow ${powered ? "pulse" : ""} ${
              powering ? "power-up" : ""
            }`}
          />
        </div>

        <div
          className="lightsaber-scene relative"
          style={{ width: "100%", height: "200px" }}
        >
          <model-viewer
            interaction-prompt="none"
            src="/3d-model/Star Wars - Lightsabers.glb"
            alt="Interactive Lightsaber"
            disable-zoom
            /* camera-controls removed to lock view */
            min-camera-orbit="0deg 0deg auto"
            max-camera-orbit="0deg 0deg auto"
            camera-orbit="0deg 0.488621995854123rad 50cm"
            exposure="1"
            style={{ width: "384px", height: "200px", cursor: "pointer" }}
          ></model-viewer>
        </div>
      </div>
    </div>
  );
};

export default HeroLightsaber;
