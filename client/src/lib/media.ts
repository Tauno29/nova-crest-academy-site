// Critical school identity media is bundled with the site so the public pages do
// not fail when an external Supabase project is paused, renamed, or unavailable.
// Admin-uploaded Gallery media remains database-driven in GalleryPage.tsx.
const publicAsset = (name: string) => `/assets/${name}`;

export const novaMedia = {
  logo: publicAsset("school-logo.png"),
  principal: publicAsset("principal.png"),
  gallery: [
    publicAsset("principal.png"),
    publicAsset("school-logo.png"),
  ],
} as const;
