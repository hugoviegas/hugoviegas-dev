// Test helper, never hot-reloaded.
/* eslint-disable react-refresh/only-export-components */
import fs from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AboutSection from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import DarcyProject from "@/pages/DarcyProject";
import BigBangDuelProject from "@/pages/BigBangDuelProject";
import BigBangDuelStoryPage from "@/pages/BigBangDuelStoryPage";
import { useLanguage } from "@/hooks/useLanguage";
import type { LanguageCode } from "@/config/languages";

// Rendered text of every surface whose content moves to Firestore. Used by the
// dual-run test to compare data-driven output with the hard-coded version.
export const targets: Record<string, () => ReactElement> = {
  experience: () => <ExperienceSection />,
  about: () => <AboutSection />,
  projects: () => <ProjectsSection />,
  darcy: () => <DarcyProject />,
  bigBang: () => <BigBangDuelProject />,
  bigBangStory: () => <BigBangDuelStoryPage />,
};

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

let setLanguage: ReturnType<typeof useLanguage>["setLanguage"];
function LanguageHandle() {
  ({ setLanguage } = useLanguage());
  return null;
}

// The story page fetches markdown from public/ in the hard-coded version.
const storyFetch = (url: string) => {
  const file = path.join(process.cwd(), "public", url);
  return Promise.resolve(
    new Response(fs.readFileSync(file, "utf-8"), { status: 200 }),
  );
};

export const renderText = async (
  name: string,
  language: LanguageCode,
): Promise<string> => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation((input) => storyFetch(String(input)));
  const view = render(
    <MemoryRouter>
      <LanguageHandle />
      {targets[name]()}
    </MemoryRouter>,
  );
  act(() => setLanguage(language));
  // Let async effects (story fetch) settle.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  // Expand every "Show more" toggle so hidden bullets are compared too.
  for (const button of view.container.querySelectorAll<HTMLButtonElement>(
    "button[aria-expanded='false']",
  )) {
    fireEvent.click(button);
  }
  const text = normalize(view.container.textContent ?? "");
  view.unmount();
  fetchMock.mockRestore();
  return text;
};
