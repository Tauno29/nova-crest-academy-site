import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Menu, X } from "lucide-react";
import { Link } from "wouter";

const logo = "https://novacrestacademy.netlify.app/assets/School%20Logo.jpeg";
const recipient = "novacrestprivateschool@gmail.com";
const navLinks = [
  ["Home", "/"],
  ["Admissions", "/admissions"],
  ["Hostel", "/hostel"],
  ["Gallery", "/gallery"],
  ["Fees", "/fees"],
  ["Parent Portal", "/parent-portal"],
] as const;

function ReferenceHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-[#005f53] text-xs text-white">
        <div className="mx-auto flex min-h-9 max-w-[1240px] items-center justify-between px-4 sm:px-5">
          <div>📍 Onanda Junction, Ogongo Circuit <span className="mx-2 opacity-60">|</span> 📞 081 800 8007</div>
          <div className="hidden gap-4 sm:flex"><span>{recipient}</span><span>Reg: CC/20240/1741</span></div>
        </div>
      </div>
      <header className="border-b border-[#ece7e1] bg-[#fffdfa]">
        <div className="mx-auto flex min-h-[70px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <img src={logo} alt="Nova Crest Academy crest" className="h-11 w-11 rounded-full object-cover" />
            <span className="display text-[22px] font-semibold tracking-tight text-[#142338]">Nova Crest</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-[0.02em] lg:flex">
            {navLinks.map(([label, href]) => (
              <Link key={href} href={href} className={href === "/parent-portal" ? "border-b-2 border-[#e6966a] pb-2 text-[#e6966a]" : "text-[#242b39] hover:text-[#e6966a]"}>{label}</Link>
            ))}
            <Link href="/admissions#application" className="rounded-full bg-[#ef986b] px-6 py-3 text-white shadow-[0_8px_18px_rgba(239,152,107,.22)] hover:bg-[#e48759]">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/admissions#application" className="rounded-full bg-[#ef986b] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white">Contact Us</Link>
            <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded-full p-2 text-[#142338] hover:bg-[#fff1e9]">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-[#ece7e1] bg-[#fffdfa] px-4 py-3 lg:hidden">
            {navLinks.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={href === "/parent-portal" ? "block border-b border-[#f1e8e2] py-3 text-sm font-bold uppercase tracking-wide text-[#e6966a]" : "block border-b border-[#f1e8e2] py-3 text-sm font-bold uppercase tracking-wide text-[#242b39]"}>{label}</Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export default function ParentPortalPage() {
  const [showCode, setShowCode] = useState(false);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Portal access is issued by Nova Crest Academy administration. Please use the username and access code provided by the school.");
  };

  return (
    <div className="min-h-screen bg-[#fffaf1] text-[#172338]">
      <ReferenceHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(105deg,#f98a61_0%,#f94662_48%,#ba27db_100%)] px-5 py-16 text-white sm:py-20 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-[1160px]">
            <div className="max-w-[760px]">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">Nova Crest Academy</p>
              <h1 className="display mt-5 text-5xl font-bold leading-[.98] sm:text-6xl lg:text-7xl">Parent Portal</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">Secure access to your child’s attendance, performance and school updates.</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-[450px]">
            <div className="rounded-[1.8rem] border border-[#e6dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(62,44,24,.08)] sm:p-7">
              <div className="mb-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1e9] text-[#ef986b]"><LockKeyhole size={18} /></div>
                  <h2 className="display text-2xl font-bold text-[#172338]">Sign in to your child’s portal</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#7c7c83]">Use the username and access code provided by the school.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-sm font-medium text-[#263142]">
                  Username
                  <input name="username" required autoComplete="username" className="mt-2 h-12 w-full rounded-2xl border border-[#dfd8cf] bg-[#fffdf7] px-4 text-[#263142] outline-none transition focus:border-[#ef986b] focus:ring-2 focus:ring-[#ef986b]/20" />
                </label>
                <label className="block text-sm font-medium text-[#263142]">
                  Access code
                  <span className="relative mt-2 block">
                    <input name="access_code" required type={showCode ? "text" : "password"} autoComplete="current-password" className="h-12 w-full rounded-2xl border border-[#dfd8cf] bg-[#fffdf7] px-4 pr-12 text-[#263142] outline-none transition focus:border-[#ef986b] focus:ring-2 focus:ring-[#ef986b]/20" />
                    <button type="button" onClick={() => setShowCode((current) => !current)} aria-label={showCode ? "Hide access code" : "Show access code"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8c8580] hover:bg-[#fff1e9] hover:text-[#d8734b]">{showCode ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                  </span>
                </label>
                <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ef986b] text-sm font-bold text-white shadow-[0_8px_16px_rgba(239,152,107,.18)] transition hover:bg-[#e48759] active:scale-[.98]">Open my portal <ArrowRight size={17} /></button>
              </form>

              {notice && <p role="status" className="mt-5 rounded-xl border border-[#f3d8ca] bg-[#fff7f2] px-4 py-3 text-sm leading-6 text-[#8f5439]">{notice}</p>}

              <p className="mt-7 text-xs leading-5 text-[#919096]">Accounts are issued by Nova Crest Academy. No placeholder records are shown.</p>
            </div>

            <div className="mt-9 grid gap-3 text-center text-sm text-[#776f6b] sm:grid-cols-3">
              <div className="rounded-2xl bg-white/75 px-3 py-4">Attendance</div>
              <div className="rounded-2xl bg-white/75 px-3 py-4">Performance</div>
              <div className="rounded-2xl bg-white/75 px-3 py-4">School updates</div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#ece5dc] bg-[#fffdfa] py-7 text-center text-xs text-[#8a8179]">Nova Crest Academy Private School · Onanda Junction, Ogongo Circuit</footer>
    </div>
  );
}
