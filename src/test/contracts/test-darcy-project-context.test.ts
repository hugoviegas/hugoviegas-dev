import { describe, expect, test } from "vitest";
import darcyContext from "../../lib/project-contexts/darcy.json";

describe("D'Arcy project context contract", () => {
  test("parses as JSON with required chatbot profile fields", () => {
    expect(darcyContext).toBeTypeOf("object");
    expect(darcyContext.summary).toBeTypeOf("string");
    expect(darcyContext.hugoRole).toBeDefined();
    expect(darcyContext.impact).toBeDefined();
    expect(darcyContext.portfolioDemo).toBeDefined();
    expect(darcyContext.prohibitedClaims).toBeDefined();
    expect(darcyContext.faq).toBeDefined();
    expect(darcyContext.faq.length).toBeGreaterThanOrEqual(8);
  });
});
