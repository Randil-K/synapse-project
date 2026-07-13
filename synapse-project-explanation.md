# Synapse — Project Explanation

*A cognitive resistance-training app for the AI era*

---

## 1. The Idea, In One Line

As AI absorbs more everyday thinking tasks (writing, planning, calculating, fact-checking, decision-making), the specific human skills those tasks used to exercise — memory recall, critical thinking, analytical reasoning, problem-solving — get less daily practice and risk quietly atrophying. Synapse is a short, daily game session designed to keep those specific muscles active, deliberately, in the face of that shift.

This is **not** framed as a medical or clinical claim, and not as generic "brain training." It's framed as **practice for skills AI is quietly taking off your hands** — an honest, specific, defensible pitch.

---

## 2. Why This Problem Is Real (Not Just a Hunch)

This isn't speculation — there's a growing body of 2025–2026 research behind it:

- A 2025 study of 666 participants found a significant negative correlation between frequent AI tool usage and critical thinking ability, mediated by **cognitive offloading** — people doing less deep, reflective thinking because AI provides fast answers.
- An MIT Media Lab study found that people writing essays with ChatGPT showed the **lowest brain engagement** of any group tested (vs. search engine or no tool), measured via EEG across 32 brain regions.
- The same 2025 research found **younger users (17–25)** show the highest AI dependence and the lowest critical thinking scores — this is your primary at-risk demographic.
- Crucially, **higher education correlates with better critical thinking regardless of AI use** — meaning deliberate practice appears to be protective. That finding is effectively Synapse's entire value proposition.

## 3. The Honest Risk You're Building Against

The "brain training" category has a credibility problem, and Synapse needs to be positioned to avoid repeating it:

- Lumosity paid a **$2M FTC settlement** in 2016 for overstating that its games improved real-world performance and could delay cognitive decline.
- The core unresolved criticism in the field is the **transfer problem**: apps reliably make people better *at the app*, but there's weak evidence this transfers to real-world thinking — because the tests used to measure improvement often look too much like the games themselves.
- **Design implication:** content should lean toward *near-real tasks* (spotting a flawed argument, catching an AI hallucination, planning under constraints) rather than purely abstract puzzles, and marketing should never use unproven clinical language ("boosts IQ," "prevents decline").

---

## 4. Target Audience

**Primary: students and knowledge workers (roughly ages 18–35), not young children.**

Reasoning:
- The research shows this age group is the most AI-dependent and most affected.
- They're self-motivated, reachable in existing online conversations about AI, and have willingness to pay.
- A children's version would require COPPA-level compliance, parental controls, and school procurement — a much slower, harder path, and better pursued later as a second product once the core concept is validated.

---

## 5. Product Content — Four Skill Pillars

| Pillar | Status | Content |
|---|---|---|
| **1. Recall & short-term memory** | ✅ Built | **Echo** (sequence recall, Simon-style), **Grid** (working memory tile recall, scaling difficulty) |
| **2. Pattern & analytical reasoning** | ✅ Built | **Pattern** (shape-rule inference: rotation, sides, color, size) |
| **3. Critical thinking about information** | 🔜 Next | **Spot the flaw** (find the logical fallacy), **AI fact-check** (find the planted hallucination in an AI-style answer — this is the most on-theme, differentiated piece of content in the whole product), **Source triage**, **Compress it** (summarize under a word limit) |
| **4. Problem-solving under real constraints** | 🔜 Next | **Logistics puzzles** (schedule/route/budget constraints), **Estimation without a calculator**, **Proofreading pass** on AI-generated text, **Mini case studies** (limited-info decision scenarios) |

### Supporting systems
- **Daily Challenge** — identical puzzle for every player each day (seeded by date, Wordle-style), rotates emphasis across the four pillars, drives the streak mechanic
- **Skill radar chart** — shows relative strength across all four pillars instead of one vague score; this is the credibility move most competitors skip
- **XP / level system** — aggregates practice across all games
- **14-day streak calendar** — visual habit reinforcement
- **Micro-lessons** — 60-second explainers ("what is cognitive offloading," "near vs. far transfer") that build trust in a category with a credibility deficit

### Deliberately excluded from v1
- No leaderboards or social competition (pulls focus toward speed over skill)
- No clinical/medical marketing language anywhere
- No subscriptions or in-app purchases until the core loop is validated

---

## 6. Technical Architecture

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind | Fast to build, modern, same codebase can later wrap into a native app |
| Backend / Auth / DB | Supabase (planned, Phase 2) | Free tier, handles accounts + Postgres without a custom server |
| Hosting | Vercel or Netlify | Free, one-click deploy from GitHub |
| Mobile / App Store (later) | Capacitor | Wraps the same web app into an iOS/Android shell — no rewrite needed |

The data layer (`storage.js`) is deliberately abstracted so every game and page reads/writes through one file. Right now it uses `localStorage`; swapping in Supabase later touches only that one file, not the games themselves.

---

## 7. Build Roadmap

**Phase 1 — Built:** Core game engine (Echo, Grid, Pattern), Daily Challenge, Progress dashboard, XP/streaks, full routing, local-only data.

**Phase 2 — Next:** Pillar 3 & 4 content (starting with *AI fact-check* and *Compress it* — cheapest to build, most distinctive), baseline skill assessment, skill radar chart, micro-lessons.

**Phase 3:** Real accounts and cross-device sync via Supabase (schema already drafted), login flow.

**Phase 4:** App Store / Play Store via Capacitor — only once the web version has proven engagement, since this phase costs real money (Apple $99/yr, Google $25 one-time) and developer time.

---

## 8. Differentiation vs. Existing Brain-Training Apps

| | Lumosity / Elevate / Peak | Synapse |
|---|---|---|
| Positioning | "Get smarter," vague wellness claims | Specific: practice for skills AI is offloading |
| Content style | Abstract puzzle games | Mix of abstract + near-real tasks (AI fact-check, logistics, proofreading) |
| Progress display | Single vague score | Four-pillar skill radar |
| Marketing honesty | History of FTC action for overclaiming | No clinical language; leads with cited research, states what's proven and what isn't |
| Target framing | General "anyone" | Specific: people who've noticed their own thinking getting lazier |

---

## 9. Go-to-Market Plan (First 50 Users)

1. **Personal network (10–15 users)** — direct outreach to specific people who've expressed this exact feeling ("I feel dumber since using ChatGPT for everything").
2. **One research-backed post, not a product pitch (15–20 users)** — lead with the actual studies, app mentioned at the end. Best homes: r/artificial, r/ChatGPT, LinkedIn (strong fit for a professional audience), Hacker News Show HN.
3. **Two to three narrow subreddits, participated in first** (10–15 users) — r/productivity, r/selfimprovement, r/GetStudying.
4. **Passive long-tail: launch directories** (5–10 users over weeks) — BetaList and similar, low effort, slow trickle.
5. Skip for now: paid ads, cold Product Hunt launch, spreading thin across many channels.

**Success signal to watch:** not signups, but whether people return on day 8 without a push notification. That's the number that tells you if the product itself is working.

---

## 10. Honest Risk Assessment

**In favor:**
- The problem is real, timely, and evidenced by current research
- Daily-habit game mechanics (streaks, daily challenge) are a proven engagement pattern
- The "AI fact-check" / resistance-training angle is a genuine, defensible differentiator nothing else in the category has

**Against:**
- This is a ~$1B market with entrenched, well-funded incumbents
- Category-wide retention pattern: engagement often plateaus around 4–8 weeks
- Distribution, not the product itself, is historically where solo projects in this space stall

**Bottom line:** plausible, not guaranteed — and the deciding factor is distribution and week-two retention, not whether the games themselves are good (they already are).

---

## Appendix: Sources Referenced

- Gerlich, M. (2025). *AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking.* Societies, 15(1), 6.
- MIT Media Lab EEG study on ChatGPT-assisted essay writing (2025).
- FTC v. Lumos Labs (2016) — $2M settlement for deceptive advertising claims.
- University of Illinois review (2016) of 370+ citations on brain-training transfer effects.
