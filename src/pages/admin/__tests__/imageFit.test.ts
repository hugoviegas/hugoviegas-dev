import { describe, expect, it, vi } from "vitest";
import { fitImage, ImageFitError, MAX_SOURCE_BYTES, type ImageEncoder } from "../imageFit";

const MB = 1024 * 1024;
const bitmap = (width: number, height: number) =>
  ({ width, height, close: vi.fn() }) as unknown as ImageBitmap;
const decodeAs = (width: number, height: number) => async () => bitmap(width, height);
const fileOf = (bytes: number, type: string, name = "photo.jpg") =>
  ({ size: bytes, type, name }) as File;

// Fake WebP encoder: size grows with pixels and quality.
const encoder = (bytesPerPixelAtFull: number): ImageEncoder =>
  vi.fn(async (_source, width, height, quality) => {
    const size = Math.round(width * height * bytesPerPixelAtFull * quality);
    return new Blob([new Uint8Array(size)], { type: "image/webp" });
  });

describe("fitImage", () => {
  it("keeps an allowed image under the limit untouched", async () => {
    const encode = encoder(1);
    const file = fileOf(1 * MB, "image/jpeg");
    const fitted = await fitImage(file, 3 * MB, { decode: decodeAs(1600, 1200), encode });
    expect(fitted).toEqual({ file, width: 1600, height: 1200 });
    expect(encode).not.toHaveBeenCalled();
  });

  it("re-encodes at the highest quality that fits before shrinking", async () => {
    // 4000x3000 at 0.25 B/px: 0.92 -> 2.63 MB fits 3 MB at full size.
    const encode = encoder(0.25);
    const fitted = await fitImage(fileOf(9 * MB, "image/jpeg", "big.jpeg"), 3 * MB, {
      decode: decodeAs(4000, 3000),
      encode,
    });
    expect(encode).toHaveBeenCalledOnce();
    expect(encode).toHaveBeenCalledWith(expect.anything(), 4000, 3000, 0.92, undefined);
    expect(fitted).toMatchObject({ width: 4000, height: 3000, originalBytes: 9 * MB });
    expect(fitted.file.name).toBe("big.webp");
    expect(fitted.file.type).toBe("image/webp");
  });

  it("lowers quality, then dimensions, only as far as needed", async () => {
    // At 0.5 B/px a 4000x3000 image is 4.8 MB even at quality 0.8, so it
    // shrinks once, by the estimated factor, and fits at quality 0.86.
    const encode = encoder(0.5);
    const fitted = await fitImage(fileOf(12 * MB, "image/png"), 3 * MB, { decode: decodeAs(4000, 3000), encode });
    expect(fitted.file.size).toBeLessThanOrEqual(3 * MB);
    expect(fitted.file.size).toBeGreaterThan(2.7 * MB);
    expect(encode).toHaveBeenCalledTimes(4);
    expect((encode as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[3])).toEqual([0.92, 0.86, 0.8, 0.86]);
    expect(fitted.width).toBeGreaterThan(3000);
    expect(fitted.width / fitted.height).toBeCloseTo(4 / 3, 2);
  });

  it("tries one larger size when shrinking overshoots", async () => {
    // Detail-heavy fake: size falls faster than the area, so the first
    // estimate lands well under the limit and a larger retry still fits.
    const encode: ImageEncoder = vi.fn(async (_source, width, height, quality) => {
      const size = Math.round(width * height * 0.5 * quality * (width / 4000) ** 0.6);
      return new Blob([new Uint8Array(size)], { type: "image/webp" });
    });
    const fitted = await fitImage(fileOf(12 * MB, "image/png"), 3 * MB, { decode: decodeAs(4000, 3000), encode });
    expect(encode).toHaveBeenCalledTimes(5);
    const [first, retry] = (encode as ReturnType<typeof vi.fn>).mock.calls.slice(3).map((call) => call[1]);
    expect(retry).toBeGreaterThan(first);
    expect(fitted.width).toBe(retry);
    expect(fitted.file.size).toBeLessThanOrEqual(3 * MB);
  });

  it("re-encodes a crop even when the file is small, at the crop's size", async () => {
    const encode = encoder(0.1);
    const crop = { sx: 100, sy: 50, sw: 600, sh: 600 };
    const fitted = await fitImage(fileOf(200_000, "image/jpeg"), 2 * MB, { decode: decodeAs(1200, 800), encode, crop });
    expect(encode).toHaveBeenCalledWith(expect.anything(), 600, 600, 0.92, crop);
    expect(fitted).toMatchObject({ width: 600, height: 600 });
    expect(fitted.file.type).toBe("image/webp");
  });

  it("keeps a small file untouched when the crop is the whole image", async () => {
    const encode = encoder(0.1);
    const file = fileOf(200_000, "image/jpeg");
    const fitted = await fitImage(file, 2 * MB, {
      decode: decodeAs(1200, 800),
      encode,
      crop: { sx: 0, sy: 0, sw: 1200, sh: 800 },
    });
    expect(fitted.file).toBe(file);
    expect(encode).not.toHaveBeenCalled();
  });

  it("converts other formats even when they are small", async () => {
    const encode = encoder(0.1);
    const fitted = await fitImage(fileOf(500_000, "image/gif", "anim.gif"), 3 * MB, {
      decode: decodeAs(400, 400),
      encode,
    });
    expect(fitted.file.name).toBe("anim.webp");
  });

  it("caps very large dimensions for the canvas", async () => {
    const encode = encoder(0.01);
    const fitted = await fitImage(fileOf(30 * MB, "image/png"), 3 * MB, { decode: decodeAs(16000, 8000), encode });
    expect([fitted.width, fitted.height]).toEqual([8192, 4096]);
  });

  it.each([
    ["an undecodable file", fileOf(1 * MB, "image/heic"), async () => Promise.reject(new Error("nope")), "decode"],
    ["a source over the ceiling", fileOf(MAX_SOURCE_BYTES + 1, "image/jpeg"), decodeAs(10, 10), "sourceSize"],
  ])("rejects %s", async (_name, file, decode, problem) => {
    await expect(fitImage(file, 3 * MB, { decode, encode: encoder(1) })).rejects.toMatchObject({ problem });
  });

  it("gives up when even the smallest size is too big", async () => {
    const error = await fitImage(fileOf(10 * MB, "image/jpeg"), 10, { decode: decodeAs(4000, 3000), encode: encoder(1) }).catch(
      (err) => err,
    );
    expect(error).toBeInstanceOf(ImageFitError);
    expect(error.problem).toBe("noFit");
  });
});
