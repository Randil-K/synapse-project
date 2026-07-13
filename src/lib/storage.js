// ---------------------------------------------------------------------------
// Data layer. Everything the app needs (profile, best scores, daily streaks)
// goes through this file. Right now it reads/writes localStorage so the app
// works fully offline with zero setup. In Phase 2 we swap the internals of
// each function for a Supabase call — nothing in the game components or
// pages needs to change, since they only ever import from here.
// ---------------------------------------------------------------------------

const NS = "brainarcade:";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fail silently, app still works this session */
  }
}

// ---- Profile -----------------------------------------------------------
export function getProfile() {
  return read("profile", { name: "Guest", createdAt: new Date().toISOString() });
}
export function saveProfile(profile) {
  write("profile", profile);
}

// ---- Scores --------------------------------------------------------------
// scores shape: { echo, grid, pattern, factcheck, compress }
export function getScores() {
  return read("scores", { echo: 0, grid: 0, pattern: 0, factcheck: 0, compress: 0 });
}
export function recordScore(game, value) {
  const scores = getScores();
  if (value > (scores[game] || 0)) {
    scores[game] = value;
    write("scores", scores);
  }
  return scores;
}

// ---- XP / level ------------------------------------------------------
// Simple aggregate: every round played across every game earns XP.
export function getXP() {
  return read("xp", 0);
}
export function addXP(amount) {
  const xp = getXP() + amount;
  write("xp", xp);
  return xp;
}
export function levelForXP(xp) {
  // Each level needs a bit more than the last (soft curve).
  let level = 1, need = 100, remaining = xp;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = Math.round(need * 1.25);
  }
  return { level, progress: remaining, needed: need };
}

// ---- Daily challenge / streaks -----------------------------------------
// history shape: { "2026-07-13": { completed: true, score: 4 }, ... }
export function getDailyHistory() {
  return read("daily", {});
}
export function recordDailyResult(dateKey, result) {
  const history = getDailyHistory();
  history[dateKey] = result;
  write("daily", history);
  return computeStreak(history);
}
export function computeStreak(history = getDailyHistory()) {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (history[key]?.completed) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ---- Pillar scores (for skill radar chart) ------------------------------
// Shape: { memory: 0-100, pattern: 0-100, critical: 0-100, problem: 0-100 }
// Each pillar score is a running weighted average that drifts toward
// the most recent result so it reflects current ability, not peak ever.
const PILLAR_DEFAULTS = { memory: 0, pattern: 0, critical: 0, problem: 0 };

export function getPillarScores() {
  return read("pillars", PILLAR_DEFAULTS);
}

export function updatePillarScore(pillar, value) {
  // value should already be 0–100 normalised by the caller
  const pillars = getPillarScores();
  const prev = pillars[pillar] || 0;
  // Weighted blend: 70% existing, 30% new — converges but reacts to change
  pillars[pillar] = prev === 0
    ? value
    : Math.round(prev * 0.7 + value * 0.3);
  write("pillars", pillars);
  return pillars;
}

export function savePillarScores(scores) {
  write("pillars", { ...PILLAR_DEFAULTS, ...scores });
}

// ---- Baseline Assessment -----------------------------------------------
export function hasCompletedAssessment() {
  return read("assessed", false);
}
export function markAssessmentComplete() {
  write("assessed", true);
}

// ---- Micro-lessons read tracking ---------------------------------------
export function getLessonsRead() {
  return read("lessons", {});
}
export function markLessonRead(id) {
  const lessons = getLessonsRead();
  lessons[id] = true;
  write("lessons", lessons);
}
