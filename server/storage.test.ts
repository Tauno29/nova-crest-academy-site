import { afterEach, describe, expect, it, vi } from "vitest";
import { storagePut, storageRemove, storageRemoveByPublicUrl } from "./storage";

describe.skipIf(!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)("Supabase Storage adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads bytes to the configured public school-images bucket", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "" }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await storagePut("gallery/test-image.jpg", Buffer.from("image-bytes"), "image/jpeg");
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toMatch(/\/storage\/v1\/object\/school-images\/gallery\/test-image_[a-f0-9]{8}\.jpg$/);
    expect(request.method).toBe("POST");
    expect(request.headers).toMatchObject({
      "Content-Type": "image/jpeg",
      "x-upsert": "false",
    });
    expect(result.url).toMatch(/\/storage\/v1\/object\/public\/school-images\/gallery\/test-image_[a-f0-9]{8}\.jpg$/);
    expect(result.key).toMatch(/^gallery\/test-image_[a-f0-9]{8}\.jpg$/);
  });

  it("deletes a managed object through the Storage API", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "" }));
    vi.stubGlobal("fetch", fetchMock);

    await storageRemove("gallery/test-image.jpg");
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe(`${process.env.SUPABASE_URL}/storage/v1/object/school-images`);
    expect(request.method).toBe("DELETE");
    expect(request.body).toBe(JSON.stringify({ prefixes: ["gallery/test-image.jpg"] }));
  });

  it("derives a managed object key from its public URL before deletion", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "" }));
    vi.stubGlobal("fetch", fetchMock);

    await storageRemoveByPublicUrl(`${process.env.SUPABASE_URL}/storage/v1/object/public/school-images/gallery/managed%20image.jpg`);
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(request.method).toBe("DELETE");
    expect(request.body).toBe(JSON.stringify({ prefixes: ["gallery/managed image.jpg"] }));
  });
});
