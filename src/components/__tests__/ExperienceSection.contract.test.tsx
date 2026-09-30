import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ExperienceSection } from "@/components/ExperienceSection";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/config/translations";

let setLanguage: ReturnType<typeof useLanguage>["setLanguage"];

function LanguageHandle() {
  ({ setLanguage } = useLanguage());
  return null;
}

const renderSection = () =>
  render(
    <>
      <LanguageHandle />
      <ExperienceSection />
    </>,
  );

describe("ExperienceSection freelance and ICOT entries", () => {
  it("has EN and PT-BR values for every new key", () => {
    const keys = Object.keys(translations).filter(
      (key) => key.startsWith("exp.freelance.") || key.startsWith("edu.icot."),
    );

    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      expect(translations[key].EN.trim()).not.toBe("");
      expect(translations[key].PT.trim()).not.toBe("");
    }
  });

  it("renders the entries in English", () => {
    renderSection();
    act(() => setLanguage("EN"));

    expect(screen.getByText("Web Developer")).toBeInTheDocument();
    expect(screen.getByText("Self-employed")).toBeInTheDocument();
    expect(screen.getByText("Jun 2023 – Mar 2024")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Professional English Language Programme (Level C1 – Advanced)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Aug 2022 – Apr 2024")).toBeInTheDocument();
  });

  it("renders the entries in Brazilian Portuguese", () => {
    renderSection();
    act(() => setLanguage("PT"));

    expect(screen.getByText("Desenvolvedor Web")).toBeInTheDocument();
    expect(screen.getByText("Autônomo")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Programa Profissional de Língua Inglesa (Nível C1 – Avançado)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Ago 2022 – Abr 2024")).toBeInTheDocument();

    act(() => setLanguage("EN"));
  });
});
