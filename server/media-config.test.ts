import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("deployed media configuration", () => {
  it("uses durable WebDev storage paths for all reference media", () => {
    const media = readProjectFile("client/src/lib/media.ts");

    expect(media).toContain("/manus-storage/school-logo_d4c617a1.jpeg");
    expect(media).toContain("/manus-storage/principal_cd73a969.jpeg");
    expect(media).toContain("/manus-storage/gallery-1_79981f54.JPG");
    expect(media).toContain("/manus-storage/gallery-2_55b656ff.JPG");
    expect(media).not.toContain("novacrestacademy.netlify.app/assets");
  });

  it("keeps the legacy same-domain asset URL out of page sources", () => {
    const pageFiles = [
      "client/src/pages/Home.tsx",
      "client/src/pages/GalleryPage.tsx",
      "client/src/pages/HostelPage.tsx",
      "client/src/pages/FeesPage.tsx",
      "client/src/pages/InnerPage.tsx",
      "client/src/pages/AdminPortalPage.tsx",
    ];

    for (const pageFile of pageFiles) {
      expect(readProjectFile(pageFile)).not.toContain("novacrestacademy.netlify.app/assets");
    }
  });
});
