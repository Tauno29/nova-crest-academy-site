import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, FileText, GraduationCap, KeyRound, LayoutDashboard, Loader2, LogOut, Megaphone, Save, ShieldCheck, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const sections = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "content", label: "Site content", icon: FileText },
  { key: "learners", label: "Learners & classes", icon: GraduationCap },
  { key: "parents", label: "Parent accounts", icon: KeyRound },
  { key: "marks", label: "Performance", icon: BookOpen },
  { key: "updates", label: "Urgent updates", icon: Megaphone },
];

function AdminLogin() {
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Welcome to the Nova Crest admin portal.");
    },
    onError: error => toast.error(error.message),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden rounded-[2rem] bg-[#153f3b] p-12 text-white shadow-2xl lg:block">
          <div className="mb-16 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f4b39d]"><ShieldCheck className="h-5 w-5" /> Nova Crest Academy</div>
          <p className="max-w-lg font-serif text-6xl leading-[.98]">A calm command centre for every learner story.</p>
          <p className="mt-8 max-w-md text-base leading-7 text-white/70">Manage school content, class records, parent access, performance and important notices from one protected workspace.</p>
        </section>
        <Card className="mx-auto w-full max-w-md rounded-[1.75rem] border-0 bg-white shadow-xl shadow-slate-200/60">
          <CardHeader className="space-y-4 p-8 pb-4 sm:p-10 sm:pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4b39d]/25 text-[#b65347]"><ShieldCheck className="h-6 w-6" /></div>
            <div><CardTitle className="font-serif text-3xl text-[#153f3b]">Admin sign in</CardTitle><CardDescription className="mt-2 leading-6">Use the administrator credentials configured for Nova Crest Academy.</CardDescription></div>
          </CardHeader>
          <CardContent className="p-8 pt-3 sm:p-10 sm:pt-4">
            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2"><Label htmlFor="admin-email">Email address</Label><Input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></div>
              <Button className="h-12 w-full rounded-xl bg-[#153f3b] text-white hover:bg-[#235b55]" disabled={login.isPending}>{login.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking credentials…</> : "Continue to dashboard"}</Button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-slate-500">This area is restricted to authorised school administrators. Parent access is managed separately.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Overview({ onSelect }: { onSelect: (section: string) => void }) {
  const dashboard = trpc.admin.dashboard.useQuery();
  const metrics = dashboard.data ? [
    ["Learners", dashboard.data.learners, GraduationCap, "Import class lists to begin"],
    ["Parent accounts", dashboard.data.parentAccounts, Users, "Issue secure access codes"],
    ["Content sections", dashboard.data.contentSections, FileText, "Keep the public site current"],
    ["Urgent updates", dashboard.data.urgentUpdates, Megaphone, "Publish notices to parents"],
  ] as const : [];

  if (dashboard.isLoading) return <div className="flex items-center gap-2 py-12 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Loading your school overview…</div>;
  return <div className="space-y-8">
    <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b65347]">Administrator workspace</p><h1 className="mt-2 font-serif text-4xl text-[#153f3b]">Good morning, let’s keep school moving.</h1><p className="mt-2 max-w-2xl text-slate-600">Your portal is ready for real school data. Start by adding content, importing a class list, or creating parent access.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, Icon, description]) => <Card key={label} className="rounded-2xl border-0 shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold text-[#153f3b]">{value}</p></div><div className="rounded-xl bg-[#f8f4ee] p-3 text-[#b65347]"><Icon className="h-5 w-5" /></div></div><p className="mt-4 text-xs text-slate-500">{description}</p></CardContent></Card>)}</div>
    <div className="grid gap-5 md:grid-cols-3"><Card className="rounded-2xl border-0 bg-[#153f3b] text-white shadow-sm md:col-span-2"><CardHeader><CardTitle className="font-serif text-2xl">Build your school record</CardTitle><CardDescription className="text-white/65">A simple order of operations keeps parent-facing information accurate.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3">{[["01", "Add learners", "Import a class list"], ["02", "Issue access", "Generate parent codes"], ["03", "Share progress", "Enter marks and updates"]].map(([number, title, text]) => <button key={number} onClick={() => onSelect(title === "Add learners" ? "learners" : title === "Issue access" ? "parents" : "marks")} className="rounded-xl bg-white/10 p-4 text-left transition hover:bg-white/15"><span className="text-xs font-semibold text-[#f4b39d]">{number}</span><p className="mt-5 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-white/65">{text}</p></button>)}</CardContent></Card><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-[#b65347]" />Data boundary</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-slate-600">Only authenticated administrators can access learner records, marks, documents and parent credentials.</CardContent></Card></div>
  </div>;
}

function ContentEditor() {
  const utils = trpc.useUtils();
  const content = trpc.admin.content.list.useQuery();
  const save = trpc.admin.content.save.useMutation({ onSuccess: async () => { await utils.admin.content.list.invalidate(); await utils.admin.dashboard.invalidate(); toast.success("Site content saved."); }, onError: error => toast.error(error.message) });
  const [contentKey, setContentKey] = useState(""); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [imageUrl, setImageUrl] = useState("");
  useEffect(() => { const first = content.data?.[0]; if (first && !contentKey) { setContentKey(first.contentKey); setTitle(first.title); setBody(first.body); setImageUrl(first.imageUrl ?? ""); } }, [content.data, contentKey]);
  const submit = (event: FormEvent) => { event.preventDefault(); save.mutate({ contentKey, title, body, imageUrl }); };
  return <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl text-[#153f3b]">Editable site content</CardTitle><CardDescription>Save copy by stable key so future page sections can be managed without code changes.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="content-key">Section key</Label><Input id="content-key" placeholder="home.hero" value={contentKey} onChange={event => setContentKey(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="content-title">Title</Label><Input id="content-title" value={title} onChange={event => setTitle(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="content-body">Body</Label><Textarea id="content-body" className="min-h-36" value={body} onChange={event => setBody(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="content-image">Image URL <span className="font-normal text-slate-400">(optional)</span></Label><Input id="content-image" type="url" value={imageUrl} onChange={event => setImageUrl(event.target.value)} /></div><Button className="rounded-xl bg-[#153f3b] text-white hover:bg-[#235b55]" disabled={save.isPending}>{save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save section</Button></form></CardContent></Card><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="text-base">Saved sections</CardTitle><CardDescription>{content.data?.length ?? 0} live records in the database.</CardDescription></CardHeader><CardContent className="space-y-3">{content.data?.length ? content.data.map(item => <button key={item.id} onClick={() => { setContentKey(item.contentKey); setTitle(item.title); setBody(item.body); setImageUrl(item.imageUrl ?? ""); }} className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#b65347]"><p className="font-medium text-[#153f3b]">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.contentKey}</p></button>) : <div className="rounded-xl bg-[#f8f4ee] p-5 text-sm leading-6 text-slate-600">No content sections have been saved yet. The first entry will appear here.</div>}</CardContent></Card></div>;
}

function LearnerManager() {
  const utils = trpc.useUtils();
  const learners = trpc.admin.learners.list.useQuery();
  const classes = trpc.admin.classes.list.useQuery();
  const createClass = trpc.admin.classes.create.useMutation({ onSuccess: async () => { await utils.admin.classes.list.invalidate(); toast.success("Class added."); setNewClass(""); }, onError: error => toast.error(error.message) });
  const create = trpc.admin.learners.create.useMutation({ onSuccess: async () => { await utils.admin.learners.list.invalidate(); await utils.admin.dashboard.invalidate(); toast.success("Learner added."); setFullName(""); setSurname(""); setClassName(""); }, onError: error => toast.error(error.message) });
  const [fullName, setFullName] = useState(""); const [surname, setSurname] = useState(""); const [className, setClassName] = useState(""); const [classId, setClassId] = useState(""); const [newClass, setNewClass] = useState("");
  return <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl text-[#153f3b]">Add a learner</CardTitle><CardDescription>Use this foundation for manual entry while class-list import is being connected.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); create.mutate({ fullName, surname, className, classId: classId ? Number(classId) : undefined }); }}><div className="space-y-2"><Label htmlFor="learner-name">Full name</Label><Input id="learner-name" value={fullName} onChange={event => setFullName(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="learner-surname">Surname</Label><Input id="learner-surname" value={surname} onChange={event => setSurname(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="learner-class">Class</Label><select id="learner-class" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={classId} onChange={event => { const selected = classes.data?.find(item => item.id === Number(event.target.value)); setClassId(event.target.value); setClassName(selected?.name ?? ""); }} required><option value="">Select class</option>{classes.data?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="flex gap-2"><Input placeholder="New class name" value={newClass} onChange={event => setNewClass(event.target.value)} /><Button type="button" variant="outline" className="shrink-0 rounded-xl" onClick={() => newClass.trim() && createClass.mutate({ name: newClass.trim() })}>Add class</Button></div></div><Button className="rounded-xl bg-[#153f3b] text-white hover:bg-[#235b55]" disabled={create.isPending}>{create.isPending ? "Adding…" : "Add learner"}</Button></form></CardContent></Card><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="text-base">Learners in the database</CardTitle><CardDescription>{learners.data?.length ?? 0} records</CardDescription></CardHeader><CardContent>{learners.data?.length ? <div className="space-y-2">{learners.data.map(item => <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#f8f4ee] px-4 py-3"><div><p className="font-medium text-[#153f3b]">{item.fullName} {item.surname}</p><p className="text-xs text-slate-500">{item.className}</p></div><span className="text-xs text-slate-400">#{item.id}</span></div>)}</div> : <p className="rounded-xl bg-[#f8f4ee] p-5 text-sm text-slate-600">No learners have been added yet.</p>}</CardContent></Card></div>;
}

function ParentManager() {
  const utils = trpc.useUtils();
  const parents = trpc.admin.parents.list.useQuery();
  const learners = trpc.admin.learners.list.useQuery();
  const create = trpc.admin.parents.create.useMutation({ onSuccess: async result => { await utils.admin.parents.list.invalidate(); await utils.admin.dashboard.invalidate(); setIssued(result); setParentName(""); setParentEmail(""); setLearnerIds([]); }, onError: error => toast.error(error.message) });
  const [parentName, setParentName] = useState(""); const [parentEmail, setParentEmail] = useState(""); const [learnerIds, setLearnerIds] = useState<number[]>([]); const [issued, setIssued] = useState<{ username: string; accessCode: string } | null>(null);
  return <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl text-[#153f3b]">Generate parent access</CardTitle><CardDescription>The access code is shown once. Store or share it securely with the parent.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); create.mutate({ parentName, parentEmail: parentEmail || undefined, learnerIds }); }}><div className="space-y-2"><Label htmlFor="parent-name">Parent / guardian name</Label><Input id="parent-name" value={parentName} onChange={event => setParentName(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="parent-email">Email <span className="font-normal text-slate-400">(optional)</span></Label><Input id="parent-email" type="email" value={parentEmail} onChange={event => setParentEmail(event.target.value)} /></div><div className="space-y-2"><Label>Link learners <span className="font-normal text-slate-400">(optional)</span></Label><div className="max-h-32 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">{learners.data?.length ? learners.data.map(learner => <label key={learner.id} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={learnerIds.includes(learner.id)} onChange={event => setLearnerIds(current => event.target.checked ? [...current, learner.id] : current.filter(id => id !== learner.id))} />{learner.fullName} {learner.surname} <span className="text-xs text-slate-400">· {learner.className}</span></label>) : <p className="text-xs text-slate-500">Add learners first to link children.</p>}</div></div><Button className="rounded-xl bg-[#153f3b] text-white hover:bg-[#235b55]" disabled={create.isPending}>{create.isPending ? "Generating…" : "Generate credentials"}</Button></form>{issued && <div className="mt-6 rounded-xl border border-[#f4b39d] bg-[#fff8f4] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#b65347]">Share securely now</p><p className="mt-3 text-sm text-slate-600">Username</p><p className="font-mono text-lg font-semibold text-[#153f3b]">{issued.username}</p><p className="mt-3 text-sm text-slate-600">Access code</p><p className="font-mono text-lg font-semibold tracking-widest text-[#153f3b]">{issued.accessCode}</p></div>}</CardContent></Card><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="text-base">Issued parent accounts</CardTitle><CardDescription>{parents.data?.length ?? 0} records</CardDescription></CardHeader><CardContent>{parents.data?.length ? <div className="space-y-2">{parents.data.map(item => <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#f8f4ee] px-4 py-3"><div><p className="font-medium text-[#153f3b]">{item.parentName}</p><p className="text-xs text-slate-500">{item.username}{item.parentEmail ? ` · ${item.parentEmail}` : ""}</p></div><span className="text-xs text-emerald-700">Active</span></div>)}</div> : <p className="rounded-xl bg-[#f8f4ee] p-5 text-sm text-slate-600">No parent accounts have been issued yet.</p>}</CardContent></Card></div>;
}

function PerformanceManager() {
  const utils = trpc.useUtils();
  const learners = trpc.admin.learners.list.useQuery();
  const performanceRows = trpc.admin.performance.list.useQuery({});
  const create = trpc.admin.performance.create.useMutation({ onSuccess: async () => { await utils.admin.performance.list.invalidate(); toast.success("Performance entry saved."); setActivityName(""); setMarks(""); setTotalMarks(""); }, onError: error => toast.error(error.message) });
  const [learnerId, setLearnerId] = useState(""); const [activityName, setActivityName] = useState(""); const [activityType, setActivityType] = useState("Test"); const [marks, setMarks] = useState(""); const [totalMarks, setTotalMarks] = useState("");
  return <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl text-[#153f3b]">Enter performance</CardTitle><CardDescription>Marks are validated and returned with a percentage for parent-facing summaries.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); create.mutate({ learnerId: Number(learnerId), activityName, activityType, marks: Number(marks), totalMarks: Number(totalMarks) }); }}><div className="space-y-2"><Label htmlFor="mark-learner">Learner</Label><select id="mark-learner" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={learnerId} onChange={event => setLearnerId(event.target.value)} required><option value="">Select learner</option>{learners.data?.map(learner => <option key={learner.id} value={learner.id}>{learner.fullName} {learner.surname} · {learner.className}</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="mark-name">Activity</Label><Input id="mark-name" value={activityName} onChange={event => setActivityName(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="mark-type">Type</Label><Input id="mark-type" value={activityType} onChange={event => setActivityType(event.target.value)} required /></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="mark-score">Marks achieved</Label><Input id="mark-score" type="number" min="0" value={marks} onChange={event => setMarks(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="mark-total">Total marks</Label><Input id="mark-total" type="number" min="1" value={totalMarks} onChange={event => setTotalMarks(event.target.value)} required /></div></div><Button className="rounded-xl bg-[#153f3b] text-white hover:bg-[#235b55]" disabled={create.isPending}>{create.isPending ? "Saving…" : "Save performance"}</Button></form></CardContent></Card><Card className="rounded-2xl border-0 shadow-sm"><CardHeader><CardTitle className="text-base">Recent marks</CardTitle><CardDescription>{performanceRows.data?.length ?? 0} entries</CardDescription></CardHeader><CardContent>{performanceRows.data?.length ? <div className="space-y-2">{performanceRows.data.map(entry => <div key={entry.id} className="flex items-center justify-between rounded-xl bg-[#f8f4ee] px-4 py-3"><div><p className="font-medium text-[#153f3b]">{entry.activityName}</p><p className="text-xs text-slate-500">{entry.activityType} · Learner #{entry.learnerId}</p></div><span className="font-semibold text-[#b65347]">{entry.marks}/{entry.totalMarks} ({Math.round((entry.marks / entry.totalMarks) * 100)}%)</span></div>)}</div> : <p className="rounded-xl bg-[#f8f4ee] p-5 text-sm text-slate-600">No performance entries have been added yet.</p>}</CardContent></Card></div>;
}

function PlaceholderSection({ title, icon: Icon, description, action }: { title: string; icon: typeof Users; description: string; action: string }) { return <Card className="rounded-2xl border-0 shadow-sm"><CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><div className="rounded-2xl bg-[#f8f4ee] p-4 text-[#b65347]"><Icon className="h-7 w-7" /></div><h2 className="mt-5 font-serif text-3xl text-[#153f3b]">{title}</h2><p className="mt-2 max-w-md leading-6 text-slate-600">{description}</p><Button variant="outline" className="mt-6 rounded-xl" onClick={() => toast.info(`${action} is the next admin workflow to connect.`)}>{action}</Button></CardContent></Card>; }

export default function AdminPortalPage() {
  const utils = trpc.useUtils();
  const [location] = useLocation();
  const me = trpc.auth.me.useQuery();
  const logout = trpc.admin.logout.useMutation({ onSuccess: async () => { await utils.auth.me.invalidate(); toast.success("You have been signed out."); } });
  const [section, setSection] = useState("overview");
  useEffect(() => {
    const routeSection = location.split("/")[2] ?? "overview";
    setSection(routeSection === "content" || routeSection === "learners" || routeSection === "parents" || routeSection === "marks" || routeSection === "updates" ? routeSection : "overview");
  }, [location]);
  if (me.isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#f8f4ee] text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Checking administrator session…</div>;
  if (!me.data || me.data.role !== "admin") return <AdminLogin />;
  return <DashboardLayout><div className="mx-auto max-w-7xl"> <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b65347]">Nova Crest / Admin</p><p className="mt-1 text-sm text-slate-500">{me.data.email}</p></div><Button variant="outline" className="rounded-xl" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut className="mr-2 h-4 w-4" />{logout.isPending ? "Signing out…" : "Sign out"}</Button></div><div className="mb-6 flex gap-2 overflow-x-auto pb-1">{sections.map(item => <button key={item.key} onClick={() => setSection(item.key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition ${section === item.key ? "bg-[#153f3b] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}</div>{section === "overview" && <Overview onSelect={setSection} />}{section === "content" && <ContentEditor />}{section === "learners" && <LearnerManager />}{section === "parents" && <ParentManager />}{section === "marks" && <PerformanceManager />}{section === "updates" && <PlaceholderSection title="Urgent updates" icon={Megaphone} description="Publish time-sensitive notices for authenticated parents and keep the wider public site separate from private school updates." action="Prepare update composer" />}</div></DashboardLayout>;
}
