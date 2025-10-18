# 🧩 Bevis — Proof-Based Hiring Platform (MVP)

Bevis is a next-generation hiring platform that replaces traditional CVs with **verified proof tasks** — small, skill-based micro-projects that allow candidates to _prove_ their abilities while employers can fairly review, rate, and credential them.

---

## 🚀 Overview

**Bevis MVP** is the first working prototype of the platform, designed to demonstrate the core “proof-of-skills” workflow for three user roles:

| Role          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| **Candidate** | Completes proof tasks and receives feedback from employers.          |
| **Employer**  | Posts jobs, defines proof tasks, and reviews candidate submissions.  |
| **Admin**     | Oversees the system, manages user roles, and monitors platform data. |

---

## 🧭 Tech Stack

| Layer               | Technology                                             |
| ------------------- | ------------------------------------------------------ |
| **Frontend**        | React + Vite + TypeScript + Tailwind v4                |
| **Backend**         | Supabase (PostgreSQL + Auth + Row Level Security)      |
| **UI Library**      | lucide-react (icons) + react-hot-toast (notifications) |
| **State / Routing** | React Router v6 + Context API                          |
| **Auth**            | Supabase Auth (email + password)                       |

---

## 🧱 Project Structure
```
bevis-mvp/
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Shared UI (Navbar, Sidebar, etc.)
│ │ │ ├── layout/
│ │ │ ├── ui/
│ │ ├── context/ # AuthContext + AuthProvider
│ │ ├── hooks/ # useAuth, useJobs, useProofs
│ │ ├── lib/api/ # Supabase API functions
│ │ ├── pages/
│ │ │ ├── admin/ # Admin Dashboard
│ │ │ ├── auth/ # Login / Signup
│ │ │ ├── candidate/ # Candidate pages (C1–C6)
│ │ │ ├── employer/ # Employer pages (C1–C6)
│ │ └── routes/ # Protected routes + layout wrappers
│ │ └── types/
│ └── index.css, main.tsx # Tailwind theme + root app (App.tsx)
│
└── backend/supabase/
│ ├── sql/
│ │ ├── 01_init_schema.sql
│ │ ├── 02_add_feedback_table.sql
│ │ ├── 03_add_submit_proof_rpc.sql
│ ├── schema.sql # Database schema, RLS policies, RPCs
└── config/ # Supabase CLI metadata
└── .gitignore
```
---

## 🎨 Theming & Roles

| Role      | Primary Color                | Accent         |
| --------- | ---------------------------- | -------------- |
| Candidate | `--color-candidate: #6C5CE7` | Purple         |
| Employer  | `--color-employer: #4A90E2`  | Blue           |
| Admin     | Neutral Gray                 | System default |

All Tailwind tokens are defined in `index.css` under the `@theme` section.  
Components use semantic color variables for consistent theming.

---

## 🧩 Current MVP Scope (✅ Completed)

| Code                 | Feature                                                              | Description                                                |
| -------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| **C1**               | Dashboard                                                            | Candidate overview (proofs completed, average score, etc.) |
| **C2**               | Job Listings                                                         | Browse available proof tasks/jobs                          |
| **C3**               | Job Detail                                                           | See job and associated proof task details                  |
| **C4**               | Proof Workspace                                                      | Submit proof via GitHub link + reflection                  |
| **C5**               | Feedback View                                                        | See employer feedback, ratings, and comments               |
| **C6**               | Profile                                                              | Candidate’s personal info + account overview               |
| **Admin Dashboard**  | Admin tools to view as other roles, promote users, and manage system |
| **Auth System**      | Full Supabase login + signup flow, role-based redirect               |
| **Navbar & Sidebar** | Persistent layout with responsive navigation                         |

---

## Supabase Schema Highlights

### 🗃️ Core Tables

- `users` → stores role (`candidate`, `employer`, `admin`)
- `jobs` → employer job listings
- `proof_tasks` → individual proof requirements
- `submissions` → candidate submissions + reflections
- `feedback` → employer feedback, stars, comments

### 🔒 Row Level Security

- Candidates: can only view and submit their own proofs
- Employers: can only view submissions for their own jobs
- Admins: unrestricted

### RPC Functions

| Function                   | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `is_admin(uid)`            | Checks if user is admin                  |
| `promote_to_admin()`       | Promotes logged-in user                  |
| `set_user_role(uid, role)` | Changes user role (future admin feature) |
| `handle_new_user()`        | Trigger to auto-create user record       |

---

## 🔐 Authentication Flow

- **Login / Sign-Up** handled via `AuthPage.tsx`
- Roles stored in Supabase `user_metadata`
- Role-based redirect:
  - Candidate → `/`
  - Employer → `/employer`
  - Admin → `/admin`
- Session caching via localStorage (`bevis_user`)

---

## Role Override System (Admin-only)

Admins can “View as Candidate” or “View as Employer” for testing.  
This uses a simple override in `AuthProvider`:

```ts
const overrideRole = localStorage.getItem("overrideRole");
const effectiveUser = user
  ? { ...user, role: overrideRole || user.role }
  : null;
```
This allows instant role switching without re-login or DB changes.

---

## Branching Strategy

| Branch       | Purpose                                        |
| ------------ | ---------------------------------------------- |
| **main**     | Protected — stable MVP build.                  |
| **dev**      | Active development branch.                     |
| **feature/** | New feature branches (merged into dev via PR). |
| **fix/**     | Bugfix or maintenance branches.                |

### Protected rules:

- PR required before merging into main
- No direct pushes to main
- Linear history + code review required

---

## Local Setup

1. Clone & Install

```
git clone https://github.com/Taninwat-55/bevis-mvp.git
cd bevis-mvp/frontend
npm install
```

2. Configure Environment

**Create .env.local in /frontend**

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3. Start Dev Server

```
npm run dev
```

---

**© 2025 Bevis — Proof-Based Hiring Platform (MVP)**
*Built with 💜 by Taninwat “Ice” Kaewpankan*