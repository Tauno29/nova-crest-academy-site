// Public Supabase Storage URLs for reference-site media.
// These URLs are intentionally independent of the Manus-only storage proxy so
// the same images work on the external Netlify deployment.
const supabaseStorageBase = "https://kqzopkwtlsyaywkqzjat.supabase.co/storage/v1/object/public/school-images";

export const novaMedia = {
  logo: `${supabaseStorageBase}/school-logo.jpeg`,
  principal: `${supabaseStorageBase}/principal.jpeg`,
  gallery: [
    `${supabaseStorageBase}/gallery-1.JPG`,
    `${supabaseStorageBase}/gallery-2.JPG`,
  ],
} as const;
