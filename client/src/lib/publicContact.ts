import { trpc } from "@/lib/trpc";

export type PublicContact = {
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  postalBox: string;
  registrationNumber: string;
  nextTermDate: string;
};

export const DEFAULT_PUBLIC_CONTACT: PublicContact = {
  phone: "081 800 8007",
  whatsapp: "+264 81 800 8007",
  email: "novacrestprivateschool@gmail.com",
  location: "Onanda Junction, Ogongo Circuit",
  postalBox: "P O Box 531, Okahao",
  registrationNumber: "CC/20240/1741",
  nextTermDate: "15 September 2026",
};

export function usePublicContact() {
  const contactProcedure = trpc.publicSite?.contact;
  const query = contactProcedure?.useQuery ? contactProcedure.useQuery() : { data: undefined };
  return {
    ...DEFAULT_PUBLIC_CONTACT,
    ...(query.data ?? {}),
  } satisfies PublicContact;
}
