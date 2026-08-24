import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

type PublicMobileMenuProps = {
  applyHref?: string;
  applyLabel?: string;
};

const links = [
  ["Home", "/"],
  ["Admissions", "/admissions"],
  ["Hostel", "/hostel"],
  ["Gallery", "/gallery"],
  ["Fees", "/fees"],
  ["Learner Portal", "/learner-portal"],
  ["Admin Panel", "/admin"],
] as const;

export function PublicMobileMenu({ applyHref = "/admissions", applyLabel = "Apply Now" }: PublicMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-2">
        <Link href={applyHref} onClick={() => setOpen(false)} className="pill bg-[#a74714] px-4 py-2.5 text-xs font-bold text-white">
          {applyLabel}
        </Link>
        <button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="rounded-xl border border-[#e2d9d2] p-2.5 text-[#3e3833] transition hover:bg-[#f5eee9]">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-[#eee9e4] bg-[#fffdfa] px-5 py-4 shadow-[0_14px_24px_rgba(39,27,18,.08)]">
          <nav aria-label="Mobile navigation" className="grid gap-1 text-sm font-semibold text-[#3e3833]">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-[#f5eee9] hover:text-[#9a4823]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
