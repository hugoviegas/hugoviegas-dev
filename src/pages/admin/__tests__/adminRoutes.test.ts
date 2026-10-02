import { describe, expect, it } from "vitest";
import { ADMIN_PATH } from "@/config/admin";
import { adminHref, parseAdminPath, type AdminLocation } from "../adminRoutes";

describe("admin routes", () => {
  const cases: [string, AdminLocation][] = [
    [ADMIN_PATH, { section: "overview" }],
    [`${ADMIN_PATH}/files`, { section: "files" }],
    [`${ADMIN_PATH}/settings`, { section: "settings" }],
    [`${ADMIN_PATH}/projects`, { section: "projects", view: "list" }],
    [`${ADMIN_PATH}/projects/new`, { section: "projects", view: "new" }],
    [`${ADMIN_PATH}/projects/big-bang-duel`, { section: "projects", view: "edit", id: "big-bang-duel" }],
    [`${ADMIN_PATH}/project-pages/darcy-mcgees/history`, { section: "projectDetails", view: "history", id: "darcy-mcgees" }],
    [`${ADMIN_PATH}/about`, { section: "about", view: "edit", id: "main" }],
    [`${ADMIN_PATH}/about/history`, { section: "about", view: "history", id: "main" }],
  ];

  it.each(cases)("round-trips %s", (path, location) => {
    expect(parseAdminPath(path)).toEqual(location);
    expect(adminHref(location)).toBe(path);
  });

  it("treats a trailing slash like the bare address", () => {
    expect(parseAdminPath(`${ADMIN_PATH}/skills/`)).toEqual({ section: "skills", view: "list" });
  });

  it("rejects unknown sections, bad ids and extra segments", () => {
    for (const path of [
      `${ADMIN_PATH}/nope`,
      `${ADMIN_PATH}/projects/Bad%20Id`,
      `${ADMIN_PATH}/projects/a/b`,
      `${ADMIN_PATH}/files/x`,
      `${ADMIN_PATH}/about/main`,
      "/projects",
    ]) {
      expect(parseAdminPath(path).section).toBe("notFound");
    }
  });
});
