import { Link } from "wouter";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";

function LearnerHeader() {
  return (
    <>
      <div className="bg-[#005f53] py-2 text-center text-[11px] text-white sm:text-xs">
        📍 Onanda Junction, Ogongo Circuit <span className="mx-2">|</span> 📞 081 800 8007
      </div>
      <header className="sticky top-0 z-30 border-b border-[#eee9e4] bg-[#fffdfa]/95 shadow-[0_4px_18px_rgba(39,27,18,.06)] backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="display text-[27px] font-semibold tracking-tight text-[#17263a]">Nova Crest</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[14px] md:flex">
            <Link href="/" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">HOME</Link>
            <Link href="/admissions" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">ADMISSIONS</Link>
            <Link href="/hostel" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">HOSTEL</Link>
            <Link href="/gallery" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">GALLERY</Link>
            <Link href="/fees" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">FEES</Link>
            <Link href="/learner-portal" className="border-b-2 border-[#f08a62] pb-2 font-extrabold tracking-[.1em] text-[#f08a62]">LEARNER PORTAL</Link>
            <Link href="/admin" className="font-extrabold tracking-[.1em] text-[#17263a] hover:text-[#f08a62]">ADMIN PANEL</Link>
          </nav>
          <PublicMobileMenu />
        </div>
      </header>
    </>
  );
}

export default function LearnerPortalPage() {
  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#17263a]">
      <LearnerHeader />
      <main className="mx-auto flex min-h-[calc(100vh-108px)] max-w-[1160px] items-center justify-center px-5 py-16">
        <section className="w-full max-w-[520px] rounded-[2rem] border border-[#eee1d8] bg-white p-7 shadow-[0_18px_50px_rgba(39,27,18,.08)] sm:p-10">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#f08a62]">Nova Crest Academy</p>
            <h1 className="display mt-3 text-4xl leading-tight text-[#17263a] sm:text-5xl">Learner Portal</h1>
            <p className="mt-4 text-sm leading-6 text-[#6d625b]">Enter your details to continue.</p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor="learner-student-id" className="text-sm font-bold text-[#17263a]">Student ID</label>
              <input id="learner-student-id" name="studentId" type="text" placeholder="Enter your student ID" autoComplete="username" className="mt-2 h-12 w-full rounded-xl border border-[#ded5ce] bg-[#fffdfa] px-4 text-sm text-[#17263a] outline-none transition placeholder:text-[#a99e96] focus:border-[#f08a62] focus:ring-2 focus:ring-[#f08a62]/20" />
            </div>
            <div>
              <label htmlFor="learner-pin" className="text-sm font-bold text-[#17263a]">PIN</label>
              <input id="learner-pin" name="pin" type="password" inputMode="numeric" placeholder="Enter your PIN" autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-[#ded5ce] bg-[#fffdfa] px-4 text-sm text-[#17263a] outline-none transition placeholder:text-[#a99e96] focus:border-[#f08a62] focus:ring-2 focus:ring-[#f08a62]/20" />
            </div>
            <button type="submit" className="pill mt-2 w-full bg-[#f08a62] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_16px_rgba(240,138,98,.22)] transition hover:bg-[#e37650] active:scale-[.98]">Continue</button>
          </form>
        </section>
      </main>
    </div>
  );
}

