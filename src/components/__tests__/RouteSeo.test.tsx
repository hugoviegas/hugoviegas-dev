import { afterEach, describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RouteSeo from "@/components/RouteSeo";
import { useLanguage } from "@/hooks/useLanguage";
import { routeSeo } from "@/config/seo";
import { translations } from "@/config/translations";

let setLanguage: ReturnType<typeof useLanguage>["setLanguage"];

function LanguageHandle() {
  ({ setLanguage } = useLanguage());
  return null;
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageHandle />
      <RouteSeo />
    </MemoryRouter>,
  );

const canonical = () =>
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
const robots = () =>
  document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content;
const breadcrumbs = () =>
  document.head.querySelector("#route-breadcrumbs")?.textContent;

afterEach(() => {
  if (setLanguage) act(() => setLanguage("EN"));
});

describe("RouteSeo", () => {
  it("has EN and PT-BR values for every SEO key", () => {
    for (const config of Object.values(routeSeo)) {
      for (const key of [config.titleKey, config.descriptionKey]) {
        expect(translations[key]?.EN).toBeTruthy();
        expect(translations[key]?.PT).toBeTruthy();
      }
    }
  });

  it("sets a self-referencing canonical and unique title on public routes", () => {
    const { unmount } = renderAt("/projects/darcy-mcgees");
    expect(canonical()).toBe("https://hugoviegas.dev/projects/darcy-mcgees");
    expect(document.title).toBe(translations["seo.darcy.title"].EN);
    expect(robots()).toBeUndefined();
    expect(
      document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]')
        ?.content,
    ).toBe("https://hugoviegas.dev/projects/darcy-mcgees");
    unmount();

    renderAt("/");
    expect(canonical()).toBe("https://hugoviegas.dev/");
    expect(document.title).toBe(translations["seo.home.title"].EN);
    expect(breadcrumbs()).toBeUndefined();
  });

  it("adds BreadcrumbList structured data on project pages", () => {
    renderAt("/projects/big-bang-duel/story");
    const data = JSON.parse(breadcrumbs() ?? "{}");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      "https://hugoviegas.dev/",
      "https://hugoviegas.dev/projects/big-bang-duel",
      "https://hugoviegas.dev/projects/big-bang-duel/story",
    ]);
  });

  it.each(["/formula-d", "/lightsaber", "/micro-falcon", "/starship-demo", "/nope"])(
    "marks %s as noindex without a canonical",
    (path) => {
      renderAt(path);
      expect(robots()).toBe("noindex, nofollow");
      expect(canonical()).toBeUndefined();
      expect(breadcrumbs()).toBeUndefined();
    },
  );

  it("updates <html lang> and the title when the language changes", () => {
    renderAt("/");
    act(() => setLanguage("PT"));
    expect(document.documentElement.lang).toBe("pt-BR");
    expect(document.title).toBe(translations["seo.home.title"].PT);

    act(() => setLanguage("EN"));
    expect(document.documentElement.lang).toBe("en");
  });
});
