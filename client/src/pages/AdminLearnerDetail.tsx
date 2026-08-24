import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Mark = { id: number; activityName: string; activityType: string; marks: number; totalMarks: number };

export default function AdminLearnerDetail({ learnerId }: { learnerId: number }) {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const detail = trpc.admin.learners.detail.useQuery({ id: learnerId });
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [term1Report, setTerm1Report] = useState("");
  const [term2Report, setTerm2Report] = useState("");
  const [term3Report, setTerm3Report] = useState("");
  const [markEditId, setMarkEditId] = useState<number | null>(null);
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("Test");
  const [marks, setMarks] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  useEffect(() => {
    if (!detail.data?.portalRecord) return;
    setBehaviorNotes(detail.data.portalRecord.behaviorNotes);
    setTerm1Report(detail.data.portalRecord.term1Report);
    setTerm2Report(detail.data.portalRecord.term2Report);
    setTerm3Report(detail.data.portalRecord.term3Report);
  }, [detail.data?.portalRecord]);

  const refreshDetail = async () => {
    await utils.admin.learners.detail.invalidate({ id: learnerId });
    await utils.learner.portal.invalidate();
  };
  const saveRecord = trpc.admin.learners.portalRecord.save.useMutation({
    onSuccess: async () => { await refreshDetail(); toast.success("Learner portal information saved."); },
    onError: error => toast.error(error.message),
  });
  const resetMarkForm = () => { setMarkEditId(null); setActivityName(""); setActivityType("Test"); setMarks(""); setTotalMarks(""); };
  const createMark = trpc.admin.performance.create.useMutation({
    onSuccess: async () => { resetMarkForm(); await refreshDetail(); toast.success("Mark added to learner portal."); },
    onError: error => toast.error(error.message),
  });
  const updateMark = trpc.admin.performance.update.useMutation({
    onSuccess: async () => { resetMarkForm(); await refreshDetail(); toast.success("Mark updated."); },
    onError: error => toast.error(error.message),
  });
  const removeMark = trpc.admin.performance.remove.useMutation({
    onSuccess: async () => { await refreshDetail(); toast.success("Mark deleted."); },
    onError: error => toast.error(error.message),
  });
  const learner = detail.data?.learner;
  const performance = (detail.data?.performance ?? []) as Mark[];
  const tests = useMemo(() => performance.filter(entry => entry.activityType.toLowerCase().includes("test")), [performance]);
  const exams = useMemo(() => performance.filter(entry => entry.activityType.toLowerCase().includes("exam")), [performance]);

  const startMarkEdit = (entry: Mark) => { setMarkEditId(entry.id); setActivityName(entry.activityName); setActivityType(entry.activityType); setMarks(String(entry.marks)); setTotalMarks(String(entry.totalMarks)); };
  const submitMark = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { learnerId, activityName, activityType, marks: Number(marks), totalMarks: Number(totalMarks) };
    if (markEditId !== null) updateMark.mutate({ ...payload, id: markEditId });
    else createMark.mutate(payload);
  };
  const panel = (title: string, description: string, entries: Mark[], empty: string) => <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="border-b border-slate-200 pb-4"><h2 className="text-base font-extrabold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>{entries.length ? <div className="mt-4 space-y-2">{entries.map(entry => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-100 bg-[#f8fbfd] px-3 py-3"><div><p className="font-bold">{entry.activityName}</p><p className="mt-1 text-xs text-slate-500">{entry.activityType} · {Math.round((entry.marks / entry.totalMarks) * 100)}%</p></div><div className="flex items-center gap-3"><span className="font-extrabold text-[#0b67a5]">{entry.marks}/{entry.totalMarks}</span><button type="button" aria-label={`Edit ${entry.activityName}`} onClick={() => startMarkEdit(entry)} className="text-xs font-bold text-[#0b67a5] hover:underline"><Pencil size={14}/></button><button type="button" aria-label={`Delete ${entry.activityName}`} onClick={() => { if (window.confirm(`Delete ${entry.activityName}? This cannot be undone.`)) removeMark.mutate({ id: entry.id, learnerId }); }} className="text-xs font-bold text-[#c43a3a] hover:underline"><Trash2 size={14}/></button></div></div>)}</div> : <p className="mt-4 text-sm text-slate-500">{empty}</p>}</section>;

  if (detail.isLoading) return <p className="py-10 text-sm text-slate-500">Loading learner record…</p>;
  if (!learner) return <section className="border border-dashed border-slate-300 bg-white p-8 text-center"><p className="text-sm text-slate-500">Learner record not found.</p><Button type="button" variant="outline" onClick={() => navigate("/admin/learners")} className="mt-4 rounded-sm"><ArrowLeft className="mr-2" size={16}/>Back to registry</Button></section>;

  return <>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><button type="button" onClick={() => navigate("/admin/learners")} className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0b67a5] hover:underline"><ArrowLeft size={16}/>Back to Learner Registry</button><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0b67a5]">Learner portal management</p><h1 className="mt-2 text-3xl font-extrabold text-[#0b1b32] sm:text-4xl">{learner.fullName} {learner.surname}</h1><p className="mt-2 text-sm text-slate-500">Student ID: <span className="font-bold text-[#0b1b32]">{learner.studentId || "Not assigned"}</span> · {learner.className}</p></div><div className="border border-[#cfe2ef] bg-[#f2f8fc] px-4 py-3 text-xs text-[#315d78]">Changes appear in the learner portal after saving.</div></div>
    <div className="space-y-6">
      <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="border-b border-slate-200 pb-4"><h2 className="text-base font-extrabold">Behavior and term reports</h2><p className="mt-1 text-sm text-slate-500">Update the pastoral note and report text that the learner will see.</p></div><div className="mt-5 space-y-5"><div><Label htmlFor="learner-behavior-notes">Behavior</Label><Textarea id="learner-behavior-notes" value={behaviorNotes} onChange={event => setBehaviorNotes(event.target.value)} rows={5} placeholder="Add a behavior or pastoral note…" className="mt-2 rounded-sm"/></div><div className="grid gap-5 md:grid-cols-3"><div><Label htmlFor="learner-term-1-report">Term 1 exam report</Label><Textarea id="learner-term-1-report" value={term1Report} onChange={event => setTerm1Report(event.target.value)} rows={5} placeholder="Term 1 report…" className="mt-2 rounded-sm"/></div><div><Label htmlFor="learner-term-2-report">Term 2 exam report</Label><Textarea id="learner-term-2-report" value={term2Report} onChange={event => setTerm2Report(event.target.value)} rows={5} placeholder="Term 2 report…" className="mt-2 rounded-sm"/></div><div><Label htmlFor="learner-term-3-report">Term 3 exam report</Label><Textarea id="learner-term-3-report" value={term3Report} onChange={event => setTerm3Report(event.target.value)} rows={5} placeholder="Term 3 report…" className="mt-2 rounded-sm"/></div></div><Button type="button" disabled={saveRecord.isPending} onClick={() => saveRecord.mutate({ learnerId, behaviorNotes, term1Report, term2Report, term3Report })} className="rounded-sm bg-[#0b67a5] font-bold hover:bg-[#095887]"><Save className="mr-2" size={16}/>{saveRecord.isPending ? "Saving…" : "Save portal information"}</Button></div></section>
      <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="border-b border-slate-200 pb-4"><h2 className="text-base font-extrabold">Add or edit a mark</h2><p className="mt-1 text-sm text-slate-500">Manage the records displayed under Performance, Test Marks, or Exam Marks in the learner portal.</p></div><form className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_.7fr_.7fr_auto_auto] lg:items-end" onSubmit={submitMark}><div><Label htmlFor="learner-activity-name">Activity name</Label><Input id="learner-activity-name" value={activityName} onChange={event => setActivityName(event.target.value)} required placeholder="e.g. Mathematics Test 1" className="mt-2 rounded-sm"/></div><div><Label htmlFor="learner-activity-type">Record type</Label><select id="learner-activity-type" value={activityType} onChange={event => setActivityType(event.target.value)} className="mt-2 h-10 w-full border border-slate-300 bg-white px-3 text-sm"><option value="Test">Test</option><option value="Exam">Exam</option><option value="Assignment">Assignment</option><option value="Assessment">Assessment</option></select></div><div><Label htmlFor="learner-marks">Marks achieved</Label><Input id="learner-marks" type="number" min="0" value={marks} onChange={event => setMarks(event.target.value)} required className="mt-2 rounded-sm"/></div><div><Label htmlFor="learner-total-marks">Total marks</Label><Input id="learner-total-marks" type="number" min="1" value={totalMarks} onChange={event => setTotalMarks(event.target.value)} required className="mt-2 rounded-sm"/></div><Button disabled={createMark.isPending || updateMark.isPending} className="rounded-sm bg-[#f08a62] font-bold hover:bg-[#dc7450]">{createMark.isPending || updateMark.isPending ? "Saving…" : markEditId !== null ? "Update mark" : "Add mark"}</Button>{markEditId !== null && <Button type="button" variant="outline" onClick={resetMarkForm} className="rounded-sm border-slate-300">Cancel</Button>}</form></section>
      <div className="grid gap-6 xl:grid-cols-3">{panel("Performance", "All academic records currently published for this learner.", performance, "No performance records have been entered yet.")}{panel("Test Marks", "Test records shown in the learner portal.", tests, "No test marks have been entered yet.")}{panel("Exam Marks", "Exam records shown in the learner portal.", exams, "No exam marks have been entered yet.")}</div>
    </div>
  </>;
}
