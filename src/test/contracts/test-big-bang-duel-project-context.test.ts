import { describe, expect, test } from "vitest";
import bigBangDuelContext from "../../lib/project-contexts/big-bang-duel.json";

describe("Big Bang Duel project context contract", () => {
  test("parses as JSON with required chatbot profile fields", () => {
    expect(bigBangDuelContext).toBeTypeOf("object");
    expect(bigBangDuelContext.summary).toBeTypeOf("string");
    expect(bigBangDuelContext.hugoRole).toBeDefined();
    expect(bigBangDuelContext.technologyOverview).toBeDefined();
    expect(bigBangDuelContext.allowedClaims ?? bigBangDuelContext.approvedClaims).toBeDefined();
    expect(bigBangDuelContext.prohibitedClaims).toBeDefined();
    expect(bigBangDuelContext.faq).toBeDefined();
    expect(bigBangDuelContext.faq.length).toBeGreaterThanOrEqual(3);
  });
});
