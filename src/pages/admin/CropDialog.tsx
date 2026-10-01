import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  cropRect,
  initialCrop,
  MAX_ZOOM,
  panBy,
  zoomTo,
  clampCrop,
  type AspectOption,
  type CropChoice,
  type CropState,
} from "./cropModel";
import { useAdminT } from "./adminStrings";

const PREVIEW_WIDTH = 640;
const KEY_STEP = 12;

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Crop editor: the frame is fixed, the image moves and zooms under it, and the
// preview canvas shows exactly what will be uploaded. Drag or arrow keys move,
// the slider or +/- zoom. Canvas only, so no inline styles are needed.
const CropDialog = ({
  file,
  aspects,
  initial,
  onApply,
  onCancel,
}: {
  file: File;
  aspects: AspectOption[];
  initial?: CropChoice | null;
  onApply: (choice: CropChoice) => void;
  onCancel: () => void;
}) => {
  const t = useAdminT();
  const ids = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [failed, setFailed] = useState(false);
  const [aspectIndex, setAspectIndex] = useState(() =>
    Math.max(0, aspects.findIndex((option) => option.label === initial?.aspect.label)),
  );
  const [state, setState] = useState<CropState | null>(null);

  const imageW = bitmap?.width ?? 1;
  const imageH = bitmap?.height ?? 1;
  const aspect = aspects[aspectIndex].ratio ?? imageW / imageH;

  // Release a bitmap once it is replaced or the dialog closes, never while
  // the preview may still draw it.
  useEffect(() => () => bitmap?.close(), [bitmap]);

  useEffect(() => {
    let cancelled = false;
    createImageBitmap(file)
      .then((result) => {
        if (cancelled) return result.close();
        setBitmap(result);
        const rect = initial?.rect;
        // Reopening restores the previous frame.
        setState(
          rect
            ? {
                zoom: Math.min(result.width, result.height * (initial.aspect.ratio ?? result.width / result.height)) / rect.sw,
                cx: rect.sx + rect.sw / 2,
                cy: rect.sy + rect.sh / 2,
              }
            : initialCrop(result.width, result.height),
        );
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
    // The file and the starting crop are fixed while the dialog is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const rect = bitmap && state ? cropRect(state, imageW, imageH, aspect) : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !bitmap || !rect) return;
    canvas.width = PREVIEW_WIDTH;
    canvas.height = Math.round(PREVIEW_WIDTH / aspect);
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, canvas.width, canvas.height);
    // Rule-of-thirds guides.
    context.strokeStyle = "rgba(255, 255, 255, 0.55)";
    context.lineWidth = 1;
    for (const part of [1 / 3, 2 / 3]) {
      context.beginPath();
      context.moveTo(canvas.width * part, 0);
      context.lineTo(canvas.width * part, canvas.height);
      context.moveTo(0, canvas.height * part);
      context.lineTo(canvas.width, canvas.height * part);
      context.stroke();
    }
  }, [bitmap, rect, aspect]);

  const update = (next: (current: CropState) => CropState) =>
    setState((current) => (current ? next(current) : current));

  // Drag distances are in CSS pixels; convert to preview-canvas pixels.
  const previewScale = () => PREVIEW_WIDTH / (canvasRef.current?.clientWidth || PREVIEW_WIDTH);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const scale = previewScale();
    const dx = (event.clientX - drag.current.x) * scale;
    const dy = (event.clientY - drag.current.y) * scale;
    drag.current = { x: event.clientX, y: event.clientY };
    update((current) => panBy(current, dx, dy, PREVIEW_WIDTH, imageW, imageH, aspect));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const step = event.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    if (event.key in moves) {
      event.preventDefault();
      const [dx, dy] = moves[event.key];
      update((current) => panBy(current, dx, dy, PREVIEW_WIDTH, imageW, imageH, aspect));
    } else if (event.key === "+" || event.key === "=" || event.key === "-") {
      event.preventDefault();
      const delta = event.key === "-" ? -0.1 : 0.1;
      update((current) => zoomTo(current, current.zoom + delta, imageW, imageH, aspect));
    }
  };

  const changeAspect = (index: number) => {
    setAspectIndex(index);
    const ratio = aspects[index].ratio ?? imageW / imageH;
    update((current) => clampCrop(current, imageW, imageH, ratio));
  };

  const zoomId = `${ids}-zoom`;
  const aspectId = `${ids}-aspect`;
  const hintId = `${ids}-hint`;

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("crop.title")}</DialogTitle>
          <DialogDescription id={hintId}>{t("crop.description")}</DialogDescription>
        </DialogHeader>

        {failed && (
          <p role="alert" className="text-sm text-destructive">
            {t("upload.decode")}
          </p>
        )}
        {!failed && !rect && <p role="status">{t("crop.loading")}</p>}

        <div className={rect ? "space-y-4" : "hidden"}>
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label={t("crop.previewLabel")}
            aria-describedby={hintId}
            className="mx-auto block h-auto max-h-[55vh] w-auto max-w-full cursor-grab touch-none rounded-md border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={zoomId}>{t("crop.zoom")}</Label>
              <input
                id={zoomId}
                type="range"
                min={1}
                max={MAX_ZOOM}
                step={0.01}
                value={state?.zoom ?? 1}
                aria-valuetext={`${Math.round((state?.zoom ?? 1) * 100)}%`}
                onChange={(event) => {
                  const zoom = Number(event.target.value);
                  update((current) => zoomTo(current, zoom, imageW, imageH, aspect));
                }}
                className="h-10 w-full accent-primary"
              />
            </div>
            {aspects.length > 1 && (
              <div className="space-y-1.5">
                <Label htmlFor={aspectId}>{t("crop.aspect")}</Label>
                <select
                  id={aspectId}
                  className={selectClass}
                  value={aspectIndex}
                  onChange={(event) => changeAspect(Number(event.target.value))}
                >
                  {aspects.map((option, index) => (
                    <option key={option.label} value={index}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {rect && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {t("crop.result")} {rect.sw} × {rect.sh} px
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!bitmap}
            onClick={() => bitmap && setState(clampCrop(initialCrop(imageW, imageH), imageW, imageH, aspect))}
          >
            {t("crop.reset")}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="button" disabled={!rect} onClick={() => rect && onApply({ rect, aspect: aspects[aspectIndex] })}>
            {t("crop.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
