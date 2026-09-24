import { describe, expect, test } from "vitest";
import { detectResponseLanguage } from "@/lib/chatbot-service";

describe("chatbot response language detection", () => {
  test("detects a clearly English question", () => {
    expect(
      detectResponseLanguage("What problem did this project solve?", "PT"),
    ).toBe("en");
  });

  test("detects a clearly Portuguese question", () => {
    expect(
      detectResponseLanguage("Como foi feita a importação do menu?", "EN"),
    ).toBe("pt");
  });

  test("uses the active language for an ambiguous question", () => {
    expect(detectResponseLanguage("D'Arcy McGee?", "PT")).toBe("pt");
    expect(detectResponseLanguage("D'Arcy McGee?", "EN")).toBe("en");
  });
});
