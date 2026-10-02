// Makes any image the browser can decode fit an upload limit. Files that are
// already an allowed type and under the limit upload untouched. Others are
// re-encoded as WebP: highest quality first, and smaller dimensions only when
// quality alone is not enough. Encoded size grows roughly with pixel count,
// so the next scale is estimated from the last attempt instead of stepping
// blindly. Runs in the browser; no dependencies.
import { IMAGE_TYPES } from "@/content/uploadPolicy";
import { isFullImage, type CropRect } from "./cropModel";

// Bigger sources risk running the tab out of memory while decoding.
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;
// Browsers cap canvas size; nothing on the site needs more than this.
const MAX_SIDE = 8192;
// Tried in order at full size.
const QUALITIES = [0.92, 0.86, 0.8];
// Quality used once the image has to shrink.
const SCALED_QUALITY = 0.86;
const MAX_SCALED_ATTEMPTS = 6;
const MIN_SCALE = 0.05;

export interface FittedImage {
  file: File;
  width: number;
  height: number;
  // Set when the file was re-encoded.
  originalBytes?: number;
}

export type ImageEncoder = (
  source: ImageBitmap,
  width: number,
  height: number,
  quality: number,
  // Source area to draw; the whole image when omitted.
  crop?: CropRect,
) => Promise<Blob>;

export class ImageFitError extends Error {
  constructor(readonly problem: "decode" | "sourceSize" | "noFit") {
    super(problem);
  }
}

// WebP where the browser can encode it; JPEG on a white background otherwise
// (Safari's canvas cannot encode WebP).
export const canvasEncoder: ImageEncoder = async (source, width, height, quality, crop) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageFitError("decode");
  context.imageSmoothingQuality = "high";
  const { sx, sy, sw, sh } = crop ?? { sx: 0, sy: 0, sw: source.width, sh: source.height };
  const draw = () => context.drawImage(source, sx, sy, sw, sh, 0, 0, width, height);
  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  draw();
  const webp = await encode("image/webp");
  if (webp?.type === "image/webp") return webp;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  draw();
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new ImageFitError("decode");
  return jpeg;
};

const extension = (type: string) => IMAGE_TYPES[type] ?? "webp";

export const fitImage = async (
  file: File,
  maxBytes: number,
  {
    decode = (blob: Blob) => createImageBitmap(blob),
    encode = canvasEncoder,
    crop,
  }: {
    decode?: (blob: Blob) => Promise<ImageBitmap>;
    encode?: ImageEncoder;
    // Area chosen in the crop editor, in source pixels.
    crop?: CropRect;
  } = {},
): Promise<FittedImage> => {
  if (file.size > MAX_SOURCE_BYTES) throw new ImageFitError("sourceSize");
  let bitmap: ImageBitmap;
  try {
    bitmap = await decode(file);
  } catch {
    throw new ImageFitError("decode");
  }
  try {
    const area = crop ?? { sx: 0, sy: 0, sw: bitmap.width, sh: bitmap.height };
    const cropped = !isFullImage(area, bitmap.width, bitmap.height);
    const { sw: width, sh: height } = area;
    if (!cropped && file.type in IMAGE_TYPES && file.size <= maxBytes) return { file, width, height };

    const name = file.name.replace(/\.[^.]*$/, "") || "image";
    const attempt = async (scale: number, quality: number) => {
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const blob = await encode(bitmap, w, h, quality, cropped ? area : undefined);
      const fitted: FittedImage = {
        file: new File([blob], `${name}.${extension(blob.type)}`, { type: blob.type }),
        width: w,
        height: h,
        originalBytes: file.size,
      };
      return { fitted, fits: blob.size <= maxBytes, size: blob.size };
    };

    let scale = Math.min(1, MAX_SIDE / Math.max(width, height));
    let lastSize = 0;
    for (const quality of QUALITIES) {
      const result = await attempt(scale, quality);
      if (result.fits) return result.fitted;
      lastSize = result.size;
    }
    for (let i = 0; i < MAX_SCALED_ATTEMPTS; i += 1) {
      // Area goes with scale squared; aim a little under the limit.
      scale *= Math.min(0.95, Math.sqrt(maxBytes / lastSize) * 0.95);
      if (scale < MIN_SCALE) break;
      const result = await attempt(scale, SCALED_QUALITY);
      if (result.fits) {
        // Shrank too far: try the size the result suggests, then halfway.
        if (result.size >= maxBytes * 0.85) return result.fitted;
        const larger = Math.min(
          scale * Math.sqrt(maxBytes / result.size) * 0.97,
          MAX_SIDE / Math.max(width, height),
          1,
        );
        if (larger <= scale) return result.fitted;
        const retry = await attempt(larger, SCALED_QUALITY);
        if (retry.fits) return retry.fitted;
        const middle = await attempt((scale + larger) / 2, SCALED_QUALITY);
        return middle.fits ? middle.fitted : result.fitted;
      }
      lastSize = result.size;
    }
    throw new ImageFitError("noFit");
  } finally {
    bitmap.close?.();
  }
};
