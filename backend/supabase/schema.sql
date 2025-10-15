-- ============================================================
-- Bevis MVP Database Schema
-- Version: v0.1 | Date: 2025-10-14
-- Description: Core tables for proof-based hiring MVP
-- ============================================================

-- 1. USERS ---------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid,  -- optional during MVP
  role text check (role in ('candidate','employer')) not null,
  name text,
  email text unique,
  company_name text,
  created_at timestamptz default now()
);

-- 2. JOBS ----------------------------------------------------
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references users (id) on delete cascade,
  title text not null,
  description text,
  required_skills text[],
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- 3. PROOF TASKS ---------------------------------------------
create table if not exists proof_tasks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete cascade,
  title text not null,
  instructions text not null,
  duration_minutes int check (duration_minutes > 0),
  ai_generated boolean default false,
  created_at timestamptz default now()
);

-- 4. SUBMISSIONS ---------------------------------------------
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete cascade,
  proof_task_id uuid references proof_tasks (id) on delete cascade,
  submission_link text,
  reflection text,
  status text check (status in ('submitted','reviewed','shortlisted')) default 'submitted',
  created_at timestamptz default now()
);

-- 5. FEEDBACK -------------------------------------------------
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions (id) on delete cascade,
  reviewer_id uuid references users (id) on delete cascade,
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  comments text,
  ai_summary text,
  created_at timestamptz default now()
);

-- 6. VIEW: PROOF CARDS ---------------------------------------
create or replace view proof_cards as
select
  s.id as submission_id,
  u.name as candidate_name,
  j.title as job_title,
  p.title as task_title,
  f.rating,
  f.comments,
  f.created_at as reviewed_at
from submissions s
left join users u on s.user_id = u.id
left join proof_tasks p on s.proof_task_id = p.id
left join jobs j on p.job_id = j.id
left join feedback f on f.submission_id = s.id;

-- ============================================================
-- RLS POLICIES (simplified)
-- ============================================================

alter table users enable row level security;
alter table jobs enable row level security;
alter table proof_tasks enable row level security;
alter table submissions enable row level security;
alter table feedback enable row level security;

-- Candidates
create policy "Candidates can view published jobs"
  on jobs for select
  using (true);

create policy "Candidates can insert submissions"
  on submissions for insert
  with check (auth.uid() = user_id);

create policy "Candidates can view their own submissions"
  on submissions for select
  using (auth.uid() = user_id);

create policy "Candidates can view their own feedback"
  on feedback for select
  using (exists (
    select 1 from submissions s
    where s.id = feedback.submission_id
    and s.user_id = auth.uid()
  ));

-- Employers
create policy "Employers manage their own jobs"
  on jobs for all
  using (auth.uid() = employer_id)
  with check (auth.uid() = employer_id);

create policy "Employers can view submissions for their jobs"
  on submissions for select
  using (exists (
    select 1 from proof_tasks pt
    join jobs j on pt.job_id = j.id
    where pt.id = submissions.proof_task_id
    and j.employer_id = auth.uid()
  ));

create policy "Employers can insert feedback for their jobs"
  on feedback for insert
  with check (exists (
    select 1 from submissions s
    join proof_tasks pt on s.proof_task_id = pt.id
    join jobs j on pt.job_id = j.id
    where s.id = feedback.submission_id
    and j.employer_id = auth.uid()
  ));