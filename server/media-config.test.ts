import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("deployed media configuration", () => {
  it("uses same-site asset paths for critical public media", () => {
    const media = readProjectFile("client/src/lib/media.ts");

    expect(media).toContain('publicAsset("school-logo.png")');
    expect(media).toContain('publicAsset("principal.png")');
    expect(media).not.toContain("supabase.co/storage/v1/object/public/school-images");
    expect(media).not.toContain("/manus-storage/");
    expect(media).not.toContain("novacrestacademy.netlify.app/assets");
    expect(existsSync(resolve(projectRoot, "client/public/assets/school-logo.png"))).toBe(true);
    expect(existsSync(resolve(projectRoot, "client/public/assets/principal.png"))).toBe(true);
  });

  it("removes the homepage Learner Gallery data while preserving other homepage media", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).not.toContain("Learner Gallery");
    expect(home).not.toContain("novaMedia.gallery");
    expect(home).toContain("src={logo}");
    expect(home).toContain("src={principal}");
    expect(home).toContain("Mr Tauno Nakasole");
    expect(home).not.toContain("Mr Nakasole");
  });

  it("renders Admin-uploaded gallery records on the public Gallery page", () => {
    const galleryPage = readProjectFile("client/src/pages/GalleryPage.tsx");

    expect(galleryPage).toContain("trpc.publicSite.gallery.useQuery()");
    expect(galleryPage).toContain("item.imageUrl");
    expect(galleryPage).toContain("item.title");
    expect(galleryPage).toContain("uploaded-gallery-${item.id}");
    expect(galleryPage).toContain("Gallery categories");
    expect(galleryPage).not.toContain("novaMedia.gallery");
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
