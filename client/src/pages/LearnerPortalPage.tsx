import React, { useState } from "react";
import { Link } from "wouter";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { trpc } from "@/lib/trpc";
import { usePublicContact } from "@/lib/publicContact";

function LearnerHeader() {
  const contact = usePublicContact();
  return (
    <>
      <div className="bg-[#005f53] py-2 text-center text-[11px] text-white sm:text-xs">
        📍 {contact.location} <span className="mx-2">|</span> 📞 {contact.phone}
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

function EmptyRecordState({ children }: { children: string }) {
  return <p className="mt-4 rounded-xl bg-[#fffaf7] px-4 py-4 text-sm leading-6 text-[#8b7d73]">{children}</p>;
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
  const performance = portal.data?.performance ?? [];
  const tests = performance.filter((entry) => entry.activityType.toLowerCase().includes("test"));
  const portalRecord = portal.data?.portalRecord;
  const termReports = [
    { label: "Term 1", value: portalRecord?.term1Report ?? "" },
    { label: "Term 2", value: portalRecord?.term2Report ?? "" },
    { label: "Term 3", value: portalRecord?.term3Report ?? "" },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#17263a]">
      <LearnerHeader />
      <main className="mx-auto flex min-h-[calc(100vh-108px)] max-w-[1160px] items-start justify-center px-5 py-16">
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
                <input id="learner-pin" name="pin" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" pattern="\d{4}" placeholder="Enter your PIN" autoComplete="current-password" required className="mt-2 h-12 w-full rounded-xl border border-[#ded5ce] bg-[#fffdfa] px-4 text-sm text-[#17263a] outline-none transition placeholder:text-[#a99e96] focus:border-[#f08a62] focus:ring-2 focus:ring-[#f08a62]/20" />
              </div>
              {error && <p role="alert" className="rounded-xl border border-[#efc1bd] bg-[#fff5f3] px-4 py-3 text-sm text-[#a73b32]">{error}</p>}
              <button type="submit" disabled={login.isPending} className="pill mt-2 w-full bg-[#f08a62] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_16px_rgba(240,138,98,.22)] transition hover:bg-[#e37650] active:scale-[.98] disabled:cursor-wait disabled:opacity-60">{login.isPending ? "Signing in…" : "Continue"}</button>
            </form>
          </section>
        ) : (
          <section className="w-full max-w-[980px] rounded-[2rem] border border-[#eee1d8] bg-white p-7 shadow-[0_18px_50px_rgba(39,27,18,.08)] sm:p-10">
            {portal.isLoading ? <p className="text-center text-sm text-[#6d625b]">Loading learner record…</p> : learner ? <>
              <div className="flex flex-col justify-between gap-5 border-b border-[#eee1d8] pb-6 sm:flex-row sm:items-start">
                <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#f08a62]">Secure learner account</p><h1 className="display mt-2 text-4xl leading-tight text-[#17263a]">{learner.fullName} {learner.surname}</h1><p className="mt-2 text-sm text-[#6d625b]">Student ID: <span className="font-bold text-[#17263a]">{learner.studentId}</span></p></div>
                <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending} className="rounded-xl border border-[#ded5ce] px-4 py-2 text-sm font-bold text-[#6d625b] transition hover:border-[#f08a62] hover:text-[#a74714]">{logout.isPending ? "Exiting…" : "Log out"}</button>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#fff6ef] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#a98c7f]">Class</p><p className="mt-2 font-bold text-[#17263a]">{learner.className}</p></div>
                <div className="rounded-2xl bg-[#f2f8fc] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#7b99aa]">Teacher</p><p className="mt-2 font-bold text-[#17263a]">{learner.teacher || "Not assigned"}</p></div>
                <div className="rounded-2xl bg-[#f3fbf5] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#7ea189]">Subjects</p><p className="mt-2 font-bold text-[#17263a]">{learner.subjects || "Not assigned"}</p></div>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#eee1d8] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#a98c7f]">Performance</p><p className="mt-2 text-2xl font-extrabold text-[#17263a]">{performance.length}</p><p className="text-xs text-[#8b7d73]">published records</p></div>
                <div className="rounded-2xl border border-[#eee1d8] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#a98c7f]">Test marks</p><p className="mt-2 text-2xl font-extrabold text-[#17263a]">{tests.length}</p><p className="text-xs text-[#8b7d73]">published records</p></div>
              </div>
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#eee1d8] p-5">
                  <div className="flex items-center justify-between gap-3"><h2 className="display text-2xl text-[#17263a]">Performance</h2><span className="rounded-full bg-[#fff6ef] px-3 py-1 text-xs font-bold text-[#a74714]">{performance.length} records</span></div>
                  {performance.length ? <div className="mt-4 space-y-3">{performance.slice(0, 5).map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fffaf7] px-3 py-3 text-sm"><div><p className="font-bold text-[#17263a]">{entry.activityName}</p><p className="text-xs text-[#8b7d73]">{entry.activityType}</p></div><span className="font-extrabold text-[#f08a62]">{entry.marks}/{entry.totalMarks}</span></div>)}</div> : <EmptyRecordState>No performance records have been published yet.</EmptyRecordState>}
                </div>
                <div className="rounded-2xl border border-[#eee1d8] p-5">
                  <div className="flex items-center justify-between gap-3"><h2 className="display text-2xl text-[#17263a]">Behavior</h2><span className="rounded-full bg-[#f2f8fc] px-3 py-1 text-xs font-bold text-[#44738c]">school notes</span></div>
                  {portalRecord?.behaviorNotes?.trim() ? <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#f2f8fc] px-4 py-4 text-sm leading-6 text-[#315d78]">{portalRecord.behaviorNotes}</p> : <EmptyRecordState>No behavior notes have been published yet.</EmptyRecordState>}
                </div>
                <div className="rounded-2xl border border-[#eee1d8] p-5">
                  <div className="flex items-center justify-between gap-3"><h2 className="display text-2xl text-[#17263a]">Test marks</h2><span className="rounded-full bg-[#fff6ef] px-3 py-1 text-xs font-bold text-[#a74714]">{tests.length} records</span></div>
                  {tests.length ? <div className="mt-4 space-y-3">{tests.map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fffaf7] px-3 py-3 text-sm"><div><p className="font-bold text-[#17263a]">{entry.activityName}</p><p className="text-xs text-[#8b7d73]">{new Date(entry.performedAt).toLocaleDateString()}</p></div><span className="font-extrabold text-[#f08a62]">{entry.marks}/{entry.totalMarks}</span></div>)}</div> : <EmptyRecordState>No test marks have been published yet.</EmptyRecordState>}
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-[#eee1d8] p-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h2 className="display text-2xl text-[#17263a]">Exam reports by term</h2><p className="mt-1 text-sm text-[#8b7d73]">Term reports will appear here when published by the school.</p></div><span className="rounded-full bg-[#f2f8fc] px-3 py-1 text-xs font-bold text-[#44738c]">3 terms</span></div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">{termReports.map((term) => <div key={term.label} className="rounded-xl bg-[#fffaf7] p-4"><p className="font-bold text-[#17263a]">{term.label}</p>{term.value.trim() ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6d625b]">{term.value}</p> : <p className="mt-2 text-sm leading-6 text-[#8b7d73]">No exam report published yet.</p>}</div>)}</div>
              </div>
              <p className="mt-7 text-sm leading-6 text-[#6d625b]">Your learner record is securely connected to the Student ID and PIN issued by the school.</p>
            </> : <div className="text-center"><p className="text-sm text-[#a73b32]">We could not load this learner record.</p><button type="button" onClick={() => { setSignedIn(false); setError("Please sign in again."); }} className="mt-5 rounded-xl bg-[#f08a62] px-5 py-3 text-sm font-bold text-white">Return to sign in</button></div>}
          </section>
        )}
      </main>
    </div>
  );
}
