# Synapse — Brain Training Arcade

A small arcade of three cognitive games (sequence recall, working memory, pattern reasoning) plus a daily challenge, XP/level progress, and streaks.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## What's built (Phase 1)

- **Echo** — sequence recall (like Simon)
- **Grid** — working memory tile recall, difficulty scales with level
- **Pattern** — logic/analytical puzzles (rotation, sides, color, size rules)
- **Daily Challenge** — same puzzle for every player each day (seeded by date, like Wordle), builds a streak
- **Progress page** — XP/level, best scores per game, 14-day streak calendar
- All data currently lives in the browser's `localStorage` via `src/lib/storage.js` — works fully offline, but progress doesn't follow you across devices yet. That's Phase 2.

## Deploying the web app (do this first)

1. Push this folder to a GitHub repo.
2. Go to vercel.com, "Add New Project," import the repo. It auto-detects Vite — no config needed.
3. Deploy. You'll get a live URL (e.g. `synapse.vercel.app`) anyone can open.

Netlify works the same way if you prefer it.

## Phase 2 — Real accounts + cross-device progress

Right now every function in `src/lib/storage.js` reads/writes `localStorage`. To add real accounts:

1. Create a free project at supabase.com.
2. In the SQL editor, run:

```sql
create table profiles (
  id uuid references auth.users primary key,
  name text default 'Guest',
  xp integer default 0,
  created_at timestamptz default now()
);

create table scores (
  user_id uuid references auth.users,
  game text,
  best integer default 0,
  primary key (user_id, game)
);

create table daily_results (
  user_id uuid references auth.users,
  date date,
  completed boolean default false,
  score integer,
  primary key (user_id, date)
);

alter table profiles enable row level security;
alter table scores enable row level security;
alter table daily_results enable row level security;

create policy "own data" on profiles for all using (auth.uid() = id);
create policy "own data" on scores for all using (auth.uid() = user_id);
create policy "own data" on daily_results for all using (auth.uid() = user_id);
```

3. `npm install @supabase/supabase-js`
4. Copy your Project URL and anon key into a `.env` file:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
5. Replace the body of each function in `src/lib/storage.js` with the equivalent Supabase call (e.g. `getScores` becomes a `select` from `scores`, `recordScore` becomes an `upsert`). Because every page and game already imports from this one file, nothing else in the app needs to change.
6. Add a login screen using `supabase.auth.signInWithOtp()` (magic link — no passwords to manage) or `signInWithPassword()`.

Send me the Supabase URL/key (or just say "let's do Phase 2") and I'll wire this up for you.

## Phase 3 — App Store / Play Store

Once the web app is live and stable:

1. `npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
2. `npx cap init` then `npx cap add ios` / `npx cap add android`
3. This wraps the built web app in a native shell. You'll need Xcode (Mac) for iOS and Android Studio for Android to actually build/submit.
4. Apple Developer Program: $99/year. Google Play: $25 one-time.

This step is the most work and the only one that costs money — worth doing once you know people are actually using the web version.

## Project structure

```
src/
  lib/          data layer (storage.js), seeded RNG, audio hook
  components/   shared UI (nav, page shell, background)
  games/        Echo, Grid, Pattern, DailyChallenge
  pages/        Home, Progress
```
