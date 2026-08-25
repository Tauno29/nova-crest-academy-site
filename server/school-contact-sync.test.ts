import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("school contact synchronization", () => {
  it("invalidates the public contact cache after an Admin save", () => {
    const adminPage = read("client/src/pages/AdminPortalPage.tsx");
    expect(adminPage).toContain("utils.publicSite.contact.invalidate()");
  });

  it("binds every public contact shell to the shared contact hook", () => {
    for (const page of [
      "client/src/pages/Home.tsx",
      "client/src/pages/InnerPage.tsx",
      "client/src/pages/AdmissionsPage.tsx",
      "client/src/pages/HostelPage.tsx",
      "client/src/pages/GalleryPage.tsx",
      "client/src/pages/FeesPage.tsx",
      "client/src/pages/LearnerPortalPage.tsx",
    ]) {
      expect(read(page), page).toContain("usePublicContact");
    }
  });
});
