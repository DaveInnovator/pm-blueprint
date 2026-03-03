# PM Blueprint

Generate a full product blueprint for your startup idea using AI. Built with React + Vite + Tailwind, Supabase (auth + DB), and OpenAI via a local Express server.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL below to create the tables and policies

```sql
-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea text not null,
  target_user text not null,
  market text not null,
  revenue_model text not null,
  created_at timestamptz not null default now()
);

-- blueprints (versioned)
create table if not exists public.blueprints (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  version int not null default 1,
  content jsonb not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.projects enable row level security;
alter table public.blueprints enable row level security;

create policy "projects_select_own" on public.projects for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects for insert with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects for update using (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects for delete using (auth.uid() = user_id);

create policy "blueprints_select_own" on public.blueprints for select
  using (exists (select 1 from public.projects p where p.id = blueprints.project_id and p.user_id = auth.uid()));

create policy "blueprints_insert_own" on public.blueprints for insert
  with check (exists (select 1 from public.projects p where p.id = blueprints.project_id and p.user_id = auth.uid()));
```

3. Go to **Settings → API** and copy your `Project URL` and `anon public` key.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8787
```

### 4. Get an OpenAI API key

Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and create a key.
The key is passed as an environment variable when starting the server — it is **never** stored in the frontend.

---

## Running the app

You need **two terminals**:

**Terminal 1 — Frontend (Vite)**
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173)

**Terminal 2 — Backend (Express)**
```bash
OPENAI_API_KEY="sk-your-key-here" node server/index.js
```
Runs at [http://localhost:8787](http://localhost:8787)

---

## App flow

1. **Login** — Magic link via Supabase Auth (email only, no password)
2. **Dashboard** — See all your projects
3. **New Project** — Fill in 4 fields: idea, target user, market, revenue model
4. **Blueprint** — AI generates a structured plan with 10 sections, saved to Supabase

### Blueprint sections

| Section | What it covers |
|---|---|
| Problem | Core problem statement |
| ICP | Ideal customer profile |
| Positioning | How you're different |
| Competition | Competitor analysis (hypothesis-level) |
| MVP Features | Must/should/nice-to-have |
| 30-Day Plan | Prioritised action steps |
| North Star | Your #1 success metric |
| KPIs | Supporting metrics |
| GTM Experiments | Go-to-market channel experiments |
| Assumptions | What the AI is assuming |

---

## Project structure

```
pm-blueprint/
├── src/
│   ├── lib/
│   │   └── supabase.js        # Supabase client
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NewProject.jsx
│   │   └── Project.jsx        # Blueprint viewer
│   ├── App.jsx                # Router
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js               # Express + OpenAI
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Notes

- Competitor section is intentionally labeled "hypothesis-level" — the AI doesn't have live market data.
- OpenAI key lives server-side only. Never put it in a `VITE_` variable.
- Blueprints are versioned in the DB — future upgrades can add regeneration.
