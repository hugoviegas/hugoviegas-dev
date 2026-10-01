import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LazyImage } from "../LazyImage";

describe("LazyImage fallback", () => {
  it("switches to the bundled file when the uploaded one fails, then reports a second failure", () => {
    render(
      <LazyImage
        src="https://example.test/uploaded.webp"
        fallbackSrc="/assets/hugo-hero.webp"
        alt="Hugo Viegas"
        priority
      />,
    );
    const img = screen.getByRole("img", { name: "Hugo Viegas" });
    expect(img).toHaveAttribute("src", "https://example.test/uploaded.webp");

    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "Hugo Viegas" })).toHaveAttribute("src", "/assets/hugo-hero.webp");

    fireEvent.error(screen.getByRole("img", { name: "Hugo Viegas" }));
    expect(screen.queryByRole("img", { name: "Hugo Viegas" })).toBeNull();
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  });
});
