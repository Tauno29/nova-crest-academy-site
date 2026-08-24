import { useState } from "react";
import { Link } from "wouter";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { trpc } from "@/lib/trpc";

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
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const utils = trpc.useUtils();
  const portal = trpc.learner.portal.useQuery(undefined, { enabled: signedIn, retry: false });
  const login = trpc.learner.login.useMutation({
    onSuccess: async () => {
      setError("");
      setSignedIn(true);
      await utils.learner.portal.invalidate();
    },
    onError: (failure) => setError(failure.message),
  });
  const logout = trpc.learner.logout.useMutation({
    onSuccess: () => {
      setSignedIn(false);
      setStudentId("");
      setPin("");
      setError("");
      utils.learner.portal.reset();
    },
    onError: (failure) => setError(failure.message),
  });
  const learner = portal.data?.learner;

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#17263a]">
      <LearnerHeader />
      <main className="mx-auto flex min-h-[calc(100vh-108px)] max-w-[1160px] items-center justify-center px-5 py-16">
        {!signedIn ? (
          <section className="w-full max-w-[520px] rounded-[2rem] border border-[#eee1d8] bg-white p-7 shadow-[0_18px_50px_rgba(39,27,18,.08)] sm:p-10">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#f08a62]">Nova Crest Academy</p>
              <h1 className="display mt-3 text-4xl leading-tight text-[#17263a] sm:text-5xl">Learner Portal</h1>
              <p className="mt-4 text-sm leading-6 text-[#6d625b]">Use the Student ID and PIN assigned by the school.</p>
            </div>
            <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); setError(""); login.mutate({ studentId, pin }); }}>
              <div>
                <label htmlFor="learner-student-id" className="text-sm font-bold text-[#17263a]">Student ID</label>
                <input id="learner-student-id" name="studentId" value={studentId} onChange={(event) => setStudentId(event.target.value)} type="text" placeholder="Enter your student ID" autoComplete="username" required className="mt-2 h-12 w-full rounded-xl border border-[#ded5ce] bg-[#fffdfa] px-4 text-sm text-[#17263a] outline-none transition placeholder:text-[#a99e96] focus:border-[#f08a62] focus:ring-2 focus:ring-[#f08a62]/20" />
              </div>
              <div>
                <label htmlFor="learner-pin" className="text-sm font-bold text-[#17263a]">PIN</label>
                <input id="learner-pin" name="pin" value={pin} onChange={(event) => setPin(event.target.value.replace(/\\D/g, "").slice(0, 4))} type="password" inputMode="numeric" pattern="\\d{4}" placeholder="Enter your PIN" autoComplete="current-password" required className="mt-2 h-12 w-full rounded-xl border border-[#ded5ce] bg-[#fffdfa] px-4 text-sm text-[#17263a] outline-none transition placeholder:text-[#a99e96] focus:border-[#f08a62] focus:ring-2 focus:ring-[#f08a62]/20" />
              </div>
              {error && <p role="alert" className="rounded-xl border border-[#efc1bd] bg-[#fff5f3] px-4 py-3 text-sm text-[#a73b32]">{error}</p>}
              <button type="submit" disabled={login.isPending} className="pill mt-2 w-full bg-[#f08a62] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_16px_rgba(240,138,98,.22)] transition hover:bg-[#e37650] active:scale-[.98] disabled:cursor-wait disabled:opacity-60">{login.isPending ? "Signing in…" : "Continue"}</button>
            </form>
          </section>
        ) : (
          <section className="w-full max-w-[760px] rounded-[2rem] border border-[#eee1d8] bg-white p-7 shadow-[0_18px_50px_rgba(39,27,18,.08)] sm:p-10">
            {portal.isLoading ? <p className="text-center text-sm text-[#6d625b]">Loading learner record…</p> : learner ? <>
              <div className="flex flex-col justify-between gap-5 border-b border-[#eee1d8] pb-6 sm:flex-row sm:items-start">
                <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#f08a62]">Secure learner account</p><h1 className="display mt-2 text-4xl leading-tight text-[#17263a]">Welcome, {learner.fullName}</h1><p className="mt-2 text-sm text-[#6d625b]">Student ID: <span className="font-bold text-[#17263a]">{learner.studentId}</span></p></div>
                <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending} className="rounded-xl border border-[#ded5ce] px-4 py-2 text-sm font-bold text-[#6d625b] transition hover:border-[#f08a62] hover:text-[#a74714]">{logout.isPending ? "Exiting…" : "Log out"}</button>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#fff6ef] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#a98c7f]">Class</p><p className="mt-2 font-bold text-[#17263a]">{learner.className}</p></div>
                <div className="rounded-2xl bg-[#f2f8fc] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#7b99aa]">Teacher</p><p className="mt-2 font-bold text-[#17263a]">{learner.teacher || "Not assigned"}</p></div>
                <div className="rounded-2xl bg-[#f3fbf5] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#7ea189]">Subjects</p><p className="mt-2 font-bold text-[#17263a]">{learner.subjects || "Not assigned"}</p></div>
              </div>
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#eee1d8] p-5">
                  <div className="flex items-center justify-between gap-3"><h2 className="display text-2xl text-[#17263a]">Recent performance</h2><span className="rounded-full bg-[#fff6ef] px-3 py-1 text-xs font-bold text-[#a74714]">{portal.data?.performance.length ?? 0} records</span></div>
                  {(portal.data?.performance.length ?? 0) > 0 ? <div className="mt-4 space-y-3">{portal.data?.performance.slice(0, 5).map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fffaf7] px-3 py-3 text-sm"><div><p className="font-bold text-[#17263a]">{entry.activityName}</p><p className="text-xs text-[#8b7d73]">{entry.activityType}</p></div><span className="font-extrabold text-[#f08a62]">{entry.marks}/{entry.totalMarks}</span></div>)}</div> : <p className="mt-4 text-sm text-[#8b7d73]">No performance records have been published yet.</p>}
                </div>
                <div className="rounded-2xl border border-[#eee1d8] p-5">
                  <div className="flex items-center justify-between gap-3"><h2 className="display text-2xl text-[#17263a]">Attendance</h2><span className="rounded-full bg-[#f3fbf5] px-3 py-1 text-xs font-bold text-[#4b805b]">{portal.data?.attendance.length ?? 0} records</span></div>
                  {(portal.data?.attendance.length ?? 0) > 0 ? <div className="mt-4 space-y-3">{portal.data?.attendance.slice(0, 5).map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fffaf7] px-3 py-3 text-sm"><span className="text-[#6d625b]">{new Date(entry.attendanceDate).toLocaleDateString()}</span><span className={`font-extrabold ${entry.status.toLowerCase() === "present" ? "text-[#4b805b]" : "text-[#a73b32]"}`}>{entry.status}</span></div>)}</div> : <p className="mt-4 text-sm text-[#8b7d73]">No attendance records have been published yet.</p>}
                </div>
              </div>
              <p className="mt-7 text-sm leading-6 text-[#6d625b]">Your learner record is securely connected to the Student ID and PIN issued by the school.</p>
            </> : <div className="text-center"><p className="text-sm text-[#a73b32]">We could not load this learner record.</p><button type="button" onClick={() => { setSignedIn(false); setError("Please sign in again."); }} className="mt-5 rounded-xl bg-[#f08a62] px-5 py-3 text-sm font-bold text-white">Return to sign in</button></div>}
          </section>
        )}
      </main>
    </div>
  );
}

