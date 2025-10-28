# 🎨 Bevis Frontend (React + Vite + Tailwind v4.1)

This is the **frontend web app** for [Bevis — Proof-Based Hiring Platform](../README.md).  
It’s built with **React + TypeScript + Supabase** and styled using **Tailwind v4.1**.

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Create a .env.local file:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then open http://localhost:5173.

---

## 🧱 Tech Stack

    •	React 19 + Vite + TypeScript
    •	TailwindCSS v4.1 (@theme tokens in index.css)
    •	React Router v7
    •	Supabase (Auth + DB)
    •	Framer Motion + Lucide React + react-hot-toast

---

## 🧩 Folder Overview

    •	src/components/ — shared UI + role-based layouts
    •	src/pages/ — Candidate, Employer, Admin views
    •	src/hooks/ — custom logic (auth, jobs, proofs)
    •	src/lib/api/ — Supabase queries & mutations
    •	src/index.css — Tailwind theme tokens
    •	src/main.tsx — App entry point

---

For a complete architecture overview, see the root README

© 2025 Bevis — Proof-Based Hiring Platform
Built with 💜 by Taninwat “Ice” Kaewpankan
