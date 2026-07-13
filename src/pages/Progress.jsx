import { useState } from "react";
import {
  getProfile,
  saveProfile,
  getScores,
  getXP,
  levelForXP,
  getDailyHistory,
  computeStreak,
  todayKey,
} from "../lib/storage";
import RadarChart from "../components/RadarChart";

function lastNDays(n) {
  const days = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dd = new Date(d);
    dd.setDate(d.getDate() - i);
    days.push(dd.toISOString().slice(0, 10));
  }
  return days;
}

export default function Progress() {
  const [profile, setProfile] = useState(getProfile());
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const scores = getScores();
  const xp = getXP();
  const { level, progress, needed } = levelForXP(xp);
  const history = getDailyHistory();
  const streak = computeStreak(history);
  const days = lastNDays(14);
  const today = todayKey();

  // Normalize best scores (0-100 scale) for the 3-axis radar chart
  const radarScores = {
    echo: Math.min(100, (scores.echo || 0) * 10),       // level 10 = 100%
    grid: Math.min(100, (scores.grid || 0) * 12.5),    // level 8 = 100%
    pattern: Math.min(100, (scores.pattern || 0) * 15), // streak 7 = 100%
  };

  const saveName = () => {
    const updated = { ...profile, name: nameInput.trim() || "Guest" };
    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
  };

  const gameCards = [
    { key: "echo",      label: "Echo",          sub: "best round",  color: "text-amber" },
    { key: "grid",      label: "Grid",          sub: "best round",  color: "text-violet" },
    { key: "pattern",   label: "Pattern",       sub: "best streak", color: "text-mint" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 pb-10">

      {/* Profile + XP card */}
      <div className="bg-panel/80 border border-panelEdge rounded-xl2 p-6 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  className="bg-[#0f2226] border border-panelEdge rounded-lg px-3 py-1.5 text-ink font-display text-xl outline-none focus:border-mint"
                />
                <button onClick={saveName} className="text-xs bg-amber text-[#1c1305] rounded-full px-3 py-1.5 font-semibold">
                  Save
                </button>
              </div>
            ) : (
              <h2
                className="font-display text-2xl cursor-pointer hover:text-mint transition-colors"
                onClick={() => setEditing(true)}
                title="Click to rename"
              >
                {profile.name}
              </h2>
            )}
            <p className="text-muted text-xs font-mono mt-1">Level {level} · {xp} XP total</p>
          </div>
          <div className="text-right">
            <div className="text-3xl">🔥</div>
            <div className="font-mono text-sm text-muted">{streak}-day streak</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-[#0f2226] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber to-mint transition-all duration-500"
              style={{ width: `${Math.min(100, (progress / needed) * 100)}%` }}
            />
          </div>
          <p className="text-muted text-xs font-mono mt-1.5">{progress} / {needed} XP to level {level + 1}</p>
        </div>
      </div>

      {/* Skill Radar */}
      <div className="bg-panel/80 border border-panelEdge rounded-xl2 p-6 mb-5">
        <div className="mb-5">
          <h3 className="font-display text-lg text-ink">Skill Radar</h3>
          <p className="text-muted text-xs font-mono mt-0.5">
            Your relative performance profile across the three core games
          </p>
        </div>
        <div className="flex justify-center">
          <RadarChart scores={radarScores} />
        </div>
      </div>

      {/* Best scores */}
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {gameCards.map((g) => (
          <div key={g.key} className="bg-panel/80 border border-panelEdge rounded-xl2 p-4 text-center">
            <div className={`font-display text-3xl ${g.color}`}>{scores[g.key] || 0}</div>
            <div className="text-ink text-sm mt-1">{g.label}</div>
            <div className="text-muted text-xs font-mono">{g.sub}</div>
          </div>
        ))}
      </div>

      {/* 14-day streak calendar */}
      <div className="bg-panel/80 border border-panelEdge rounded-xl2 p-6">
        <h3 className="font-display text-lg mb-4">Last 14 days</h3>
        <div className="flex gap-1.5 flex-wrap">
          {days.map((d) => {
            const done = history[d]?.completed;
            const isToday = d === today;
            return (
              <div
                key={d}
                title={d + (done ? ` · scored ${history[d].score}` : "")}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono border ${
                  done
                    ? "bg-mint/80 border-mint text-[#0a1d1f]"
                    : isToday
                    ? "border-amber text-amber"
                    : "border-panelEdge text-muted/50"
                }`}
              >
                {d.slice(8)}
              </div>
            );
          })}
        </div>
        <p className="text-muted text-xs mt-4">
          Filled tiles are days you completed the Daily Challenge. Streaks reset if a day is missed.
        </p>
      </div>
    </div>
  );
}
