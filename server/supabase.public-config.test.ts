import { describe, expect, it } from "vitest";

describe("public Supabase configuration", () => {
  it("authenticates against the Supabase REST endpoint", async () => {
    const projectUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(projectUrl).toMatch(/^https:\/\/[^/]+\.supabase\.co$/);
    expect(anonKey).toMatch(/^eyJ/);

    const response = await fetch(`${projectUrl}/rest/v1/`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    expect(response.status).toBeLessThan(500);
  }, 20_000);

  it("serves the uploaded school images publicly", async () => {
    const projectUrl = process.env.VITE_SUPABASE_URL;
    const imageNames = ["school-logo.jpeg", "principal.jpeg", "gallery-1.JPG", "gallery-2.JPG"];

    for (const imageName of imageNames) {
      const response = await fetch(`${projectUrl}/storage/v1/object/public/school-images/${imageName}`);
      expect(response.status, imageName).toBe(200);
      expect(response.headers.get("content-type"), imageName).toMatch(/^image\/jpeg/);
    }
  }, 60_000);
});
