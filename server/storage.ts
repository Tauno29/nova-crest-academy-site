const DEFAULT_BUCKET = "school-images";

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage config missing: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Netlify environment variables.",
    );
  }

  return {
    supabaseUrl,
    serviceRoleKey,
    bucket: process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET,
  };
}

function normalizeKey(relKey: string): string {
  const key = relKey.replace(/^\/+/, "");
  if (!key || key.split("/").some(part => part === "..")) {
    throw new Error("Invalid storage object path.");
  }
  return key;
}

function encodePath(path: string): string {
  return path.split("/").map(segment => encodeURIComponent(segment)).join("/");
}

function publicObjectUrl(supabaseUrl: string, bucket: string, key: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodePath(key)}`;
}

function authHeaders(serviceRoleKey: string): Record<string, string> {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { supabaseUrl, serviceRoleKey, bucket } = getSupabaseStorageConfig();
  const key = appendHashSuffix(normalizeKey(relKey));
  const objectUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodePath(key)}`;
  const body = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data as any], { type: contentType });

  const response = await fetch(objectUrl, {
    method: "POST",
    headers: {
      ...authHeaders(serviceRoleKey),
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Supabase Storage upload failed (${response.status}): ${message}`);
  }

  return { key, url: publicObjectUrl(supabaseUrl, bucket, key) };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const { supabaseUrl, bucket } = getSupabaseStorageConfig();
  const key = normalizeKey(relKey);
  return { key, url: publicObjectUrl(supabaseUrl, bucket, key) };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const { supabaseUrl, bucket } = getSupabaseStorageConfig();
  return publicObjectUrl(supabaseUrl, bucket, normalizeKey(relKey));
}

export async function storageRemove(relKey: string): Promise<void> {
  const { supabaseUrl, serviceRoleKey, bucket } = getSupabaseStorageConfig();
  const key = normalizeKey(relKey);
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [key] }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Supabase Storage deletion failed (${response.status}): ${message}`);
  }
}

export async function storageRemoveByPublicUrl(imageUrl: string): Promise<void> {
  const { supabaseUrl, bucket } = getSupabaseStorageConfig();
  let parsed: URL;
  try {
    parsed = new URL(imageUrl, `${supabaseUrl}/`);
  } catch {
    return;
  }

  const prefix = `/storage/v1/object/public/${bucket}/`;
  if (parsed.origin !== supabaseUrl || !parsed.pathname.startsWith(prefix)) return;

  const encodedKey = parsed.pathname.slice(prefix.length);
  if (!encodedKey) return;
  const key = encodedKey.split("/").map(segment => decodeURIComponent(segment)).join("/");
  await storageRemove(key);
}
