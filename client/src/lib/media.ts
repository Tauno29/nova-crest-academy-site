// Durable WebDev storage paths for reference-site media.
// Keep these outside the repository so Netlify deploys do not depend on legacy
// same-domain asset URLs that may be rewritten to the SPA entrypoint.
export const novaMedia = {
  logo: "/manus-storage/school-logo_d4c617a1.jpeg",
  principal: "/manus-storage/principal_cd73a969.jpeg",
  gallery: [
    "/manus-storage/gallery-1_79981f54.JPG",
    "/manus-storage/gallery-2_55b656ff.JPG",
  ],
} as const;
