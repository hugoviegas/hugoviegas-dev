import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import { ADMIN_PATH } from "@/config/admin";

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({ t: (k: string) => k }),
}));

const setup = () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path={ADMIN_PATH} element={<div>target</div>} />
      </Routes>
    </MemoryRouter>,
  );
  return screen.getByText("Hugo Viegas", { selector: "p" });
};

const click = (el: HTMLElement, n: number, gap = 100) => {
  for (let i = 0; i < n; i++) {
    fireEvent.click(el);
    vi.advanceTimersByTime(gap);
  }
};

describe("Footer name shortcut", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("does not navigate on three clicks", () => {
    click(setup(), 3);
    expect(screen.queryByText("target")).toBeNull();
  });

  it("navigates on four quick clicks", () => {
    click(setup(), 4);
    expect(screen.getByText("target")).toBeTruthy();
  });

  it("does not navigate when clicks are spread out", () => {
    click(setup(), 4, 2500);
    expect(screen.queryByText("target")).toBeNull();
  });
});
