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

    expect(media).toContain("https://kqzopkwtlsyaywkqzjat.supabase.co/storage/v1/object/public/school-images");
    expect(media).toContain("school-logo.jpeg");
    expect(media).toContain("principal.jpeg");
    expect(media).toContain("gallery-1.JPG");
    expect(media).toContain("gallery-2.JPG");
    expect(media).not.toContain("/manus-storage/");
    expect(media).not.toContain("novacrestacademy.netlify.app/assets");
  });

  it("removes the homepage Learner Gallery data while preserving other homepage media", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).not.toContain("Learner Gallery");
    expect(home).not.toContain("novaMedia.gallery");
    expect(home).toContain("src={logo}");
    expect(home).toContain("src={principal}");
  });

  it("keeps the legacy same-domain asset URL out of page sources", () => {
    const pageFiles = [
      "client/src/pages/Home.tsx",
      "client/src/pages/GalleryPage.tsx",
      "client/src/pages/HostelPage.tsx",
      "client/src/pages/FeesPage.tsx",
      "client/src/pages/InnerPage.tsx",
      "client/src/pages/AdminPortalPage.tsx",
      "client/index.html",
    ];

    for (const pageFile of pageFiles) {
      expect(readProjectFile(pageFile)).not.toContain("novacrestacademy.netlify.app/assets");
    }
  });

});
