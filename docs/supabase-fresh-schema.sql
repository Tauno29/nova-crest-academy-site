-- Nova Crest Academy fresh Supabase schema
-- Run this entire script once in the SQL Editor of the new Supabase project.
-- This script creates empty tables only. It does not seed users, learners, passwords, PINs, or other records.
-- The application server connects with SUPABASE_DATABASE_URL; keep that value server-side.

do $$
begin
  create type public.user_role as enum ('user', 'admin');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.users (
  id serial primary key,
  "openId" varchar(64) not null unique,
  name text,
  email varchar(320),
  "loginMethod" varchar(64),
  role public.user_role not null default 'user',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "lastSignedIn" timestamptz not null default now()
);

create table if not exists public.parent_accounts (
  id serial primary key,
  username varchar(80) not null unique,
  "accessCodeHash" varchar(128) not null,
  "parentName" varchar(160) not null,
  "parentEmail" varchar(320),
  active integer not null default 1,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.classes (
  id serial primary key,
  name varchar(80) not null unique,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.learners (
  id serial primary key,
  "fullName" varchar(160) not null,
  surname varchar(120) not null,
  "studentId" varchar(80),
  "parentPinHash" varchar(128),
  teacher varchar(160),
  subjects text,
  "className" varchar(80) not null,
  "classId" integer references public.classes(id) on delete set null,
  "parentAccountId" integer references public.parent_accounts(id) on delete set null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.parent_account_learners (
  "parentAccountId" integer not null references public.parent_accounts(id) on delete cascade,
  "learnerId" integer not null references public.learners(id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  primary key ("parentAccountId", "learnerId")
);

create table if not exists public.performance_entries (
  id serial primary key,
  "learnerId" integer not null references public.learners(id) on delete cascade,
  "activityName" varchar(160) not null,
  "activityType" varchar(60) not null,
  marks integer not null,
  "totalMarks" integer not null,
  "performedAt" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id serial primary key,
  "learnerId" integer not null references public.learners(id) on delete cascade,
  "attendanceDate" timestamptz not null,
  status varchar(20) not null,
  note text,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.site_content (
  id serial primary key,
  "contentKey" varchar(120) not null unique,
  title varchar(180) not null,
  body text not null,
  published integer not null default 1,
  "updatedBy" integer,
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.documents (
  id serial primary key,
  filename varchar(255) not null,
  "storageKey" text not null,
  "storageUrl" text not null,
  "mimeType" varchar(120) not null,
  "uploadedBy" varchar(320) not null,
  "importStatus" varchar(30) not null default 'uploaded',
  "importedRows" integer not null default 0,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.urgent_updates (
  id serial primary key,
  title varchar(180) not null,
  body text not null,
  "isPublished" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "expiresAt" timestamptz
);

create table if not exists public.urgent_update_reads (
  "parentAccountId" integer not null references public.parent_accounts(id) on delete cascade,
  "updateId" integer not null references public.urgent_updates(id) on delete cascade,
  "readAt" timestamptz not null default now(),
  primary key ("parentAccountId", "updateId")
);

create table if not exists public.gallery_media (
  id serial primary key,
  title varchar(180) not null,
  category varchar(80) not null,
  "imageUrl" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.site_alert_config (
  id serial primary key,
  enabled integer not null default 1 check (enabled in (0, 1)),
  message text not null,
  "buttonLabel" varchar(80) not null,
  destination varchar(255) not null,
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.fee_structures (
  id serial primary key,
  "academicYear" varchar(20) not null unique,
  kindergarten varchar(80) not null,
  "prePrimary" varchar(80) not null,
  "grade1to3" varchar(80) not null,
  "developmentFund" varchar(80) not null,
  "hostelBoarding" varchar(80) not null,
  "registrationFee" varchar(80) not null,
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.school_contact_info (
  id serial primary key,
  phone varchar(80) not null,
  whatsapp varchar(80) not null,
  email varchar(320) not null,
  location varchar(180) not null,
  "postalBox" varchar(180) not null,
  "registrationNumber" varchar(80) not null,
  "nextTermDate" varchar(80) not null,
  "updatedAt" timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.parent_accounts enable row level security;
alter table public.classes enable row level security;
alter table public.learners enable row level security;
alter table public.parent_account_learners enable row level security;
alter table public.performance_entries enable row level security;
alter table public.attendance_records enable row level security;
alter table public.site_content enable row level security;
alter table public.documents enable row level security;
alter table public.urgent_updates enable row level security;
alter table public.urgent_update_reads enable row level security;
alter table public.gallery_media enable row level security;
alter table public.site_alert_config enable row level security;
alter table public.fee_structures enable row level security;
alter table public.school_contact_info enable row level security;

-- No anonymous policies are created. The application server uses its private
-- PostgreSQL connection and performs authorization in the server procedures.
