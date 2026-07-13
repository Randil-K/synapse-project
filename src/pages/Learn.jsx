import { useState } from "react";
import { getLessonsRead, markLessonRead } from "../lib/storage";

const LESSONS = [
  {
    id: "cognitive-offloading",
    icon: "🧠",
    title: "What is cognitive offloading?",
    readTime: "60 sec",
    pillar: "Why Synapse exists",
    content: `Cognitive offloading is the practice of using external tools — notebooks, calculators, GPS, and increasingly AI — to handle mental tasks that your brain would otherwise perform itself.

This isn't inherently bad. Writing things down has always extended human memory. But there's a difference between *augmenting* your thinking and *outsourcing* it entirely.

When AI handles more of your reasoning, writing, and fact-checking for you, the neural circuits that would have fired during those tasks get less use. Like any skill, cognitive abilities that aren't exercised gradually weaken — a process neuroscientists call "use-dependent plasticity."

A 2025 study of 666 participants found a significant negative correlation between frequent AI tool usage and critical thinking scores, mediated precisely by this mechanism: people doing less deep, reflective thinking because AI provides fast answers.

**Synapse's response:** give those circuits deliberate, short bursts of exercise — not to fight AI, but to stay sharp alongside it.`,
  },
  {
    id: "near-far-transfer",
    icon: "🔬",
    title: "Near vs. far transfer",
    readTime: "60 sec",
    pillar: "Why this app is different",
    content: `The biggest credibility problem in brain training is the *transfer problem*: apps reliably make people better *at the app*, but that improvement doesn't necessarily carry into real life.

Psychologists distinguish two types of transfer:
- **Near transfer**: improvement in tasks that closely resemble what you practiced (getting faster at a specific mental rotation puzzle after practicing it).
- **Far transfer**: improvement in broad cognitive abilities that show up in unrelated real-world tasks (becoming a better critical thinker generally).

Far transfer is hard to achieve and even harder to measure. Lumosity's $2M FTC settlement was partly about overstating this — claiming their games improved real-world performance when the evidence was weak.

**Synapse's design response:** lean toward *near-real tasks* (catching an AI hallucination, compressing a real argument, spotting a logical flaw) rather than abstract puzzles — so that even if transfer is imperfect, the practice is useful in its own right.

We never use clinical or IQ-improvement language. We say what we are: deliberate practice for skills AI is quietly offloading.`,
  },
  {
    id: "research-summary",
    icon: "📊",
    title: "What the research actually says",
    readTime: "60 sec",
    pillar: "The honest science",
    content: `Here's the actual evidence Synapse is built on — stated honestly, without overclaiming.

**What the research shows:**
- A 2025 study (Gerlich, *Societies*) of 666 participants found a significant negative correlation between AI tool usage frequency and critical thinking ability, mediated by cognitive offloading. Effect was strongest in 17–25 year olds.
- An MIT Media Lab EEG study found that people writing essays with ChatGPT showed the lowest brain engagement of any tested group, across 32 brain regions.
- Higher education level correlated with better critical thinking *regardless* of AI use — suggesting deliberate, structured practice is protective.

**What the research does not show:**
- That any specific brain training app improves real-world cognitive performance in a generalizable way (the transfer problem remains unsolved).
- That using AI causes permanent cognitive decline — the research shows correlation and mechanism, not irreversible harm.
- That Synapse specifically will improve your IQ, prevent decline, or produce any clinical outcome.

**What we believe, honestly:** regular deliberate practice at reasoning tasks is better than no practice. Whether it fully transfers is uncertain. The tasks themselves are useful. That's the claim we stand behind.`,
  },
  {
    id: "streak-science",
    icon: "🔥",
    title: "How streaks build habits",
    readTime: "60 sec",
    pillar: "The habit loop",
    content: `The streak mechanic in Synapse isn't arbitrary gamification — it's grounded in the psychology of habit formation.

Habits are formed through a loop: **cue → routine → reward**. The cue triggers the behavior; the reward reinforces it until it becomes automatic. Streaks create a third force: *loss aversion*. Once you have a 7-day streak, you're motivated not just by the reward of completing today's session, but by the psychological cost of *breaking* the streak.

This is why Wordle went viral: the daily constraint and streak created a ritual, and the fear of breaking it drove daily return rates that most apps never achieve.

A 2010 study by Phillippa Lally (University College London) found habits take an average of **66 days** to form, with a wide range of 18–254 days depending on complexity. Simple behaviors (drinking water) lock in faster; complex cognitive routines take longer.

**The implication for Synapse:** the first two weeks are the hardest. If you return on Day 8 without a push notification prompting you, that's the real signal — the habit is beginning to take root.

Five focused minutes a day, consistently, beats an occasional hour-long session every time.`,
  },
];

function LessonCard({ lesson, isRead, onMarkRead }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-panel/80 border rounded-xl2 overflow-hidden transition-all duration-300 ${
        isRead ? "border-mint/30" : "border-panelEdge"
      }`}
    >
      {/* Header */}
      <button
        id={`lesson-${lesson.id}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-panel/60 transition-colors"
      >
        <span className="text-2xl flex-shrink-0">{lesson.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg text-ink">{lesson.title}</h3>
            {isRead && (
              <span className="text-[10px] font-mono bg-mint/20 text-mint px-2 py-0.5 rounded-full">
                read
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-mono text-xs text-muted">{lesson.pillar}</span>
            <span className="font-mono text-xs text-muted/60">·</span>
            <span className="font-mono text-xs text-muted/60">⏱ {lesson.readTime}</span>
          </div>
        </div>
        <span
          className={`text-muted transition-transform duration-200 flex-shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-panelEdge px-5 py-5">
          <div className="text-ink/90 text-[14.5px] leading-[1.75] whitespace-pre-line">
            {lesson.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-amber font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </div>
          {!isRead && (
            <button
              onClick={() => {
                markLessonRead(lesson.id);
                onMarkRead(lesson.id);
              }}
              className="mt-5 border border-mint/40 text-mint text-xs font-mono rounded-full px-4 py-1.5 hover:bg-mint/10 transition-colors"
            >
              ✓ Mark as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  const [read, setRead] = useState(() => getLessonsRead());

  const handleMarkRead = (id) => {
    setRead((prev) => ({ ...prev, [id]: true }));
  };

  const readCount = LESSONS.filter((l) => read[l.id]).length;

  return (
    <div className="max-w-2xl mx-auto px-5 pb-12">
      {/* Header */}
      <div className="py-7">
        <div className="font-mono text-xs uppercase tracking-[0.12em] text-mint/85 mb-2">
          60-second reads
        </div>
        <h1 className="font-display text-4xl text-ink mb-2">Micro-lessons</h1>
        <p className="text-muted text-[15px] leading-relaxed max-w-md">
          The science and thinking behind Synapse — honest, cited, and brief.
        </p>
        <div className="mt-3 font-mono text-xs text-muted">
          {readCount} of {LESSONS.length} read
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-panelEdge rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber to-mint transition-all duration-500"
            style={{ width: `${(readCount / LESSONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson cards */}
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isRead={!!read[lesson.id]}
            onMarkRead={handleMarkRead}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-muted text-xs leading-relaxed font-mono">
        All claims are sourced. See the project explanation for full citations.
      </div>
    </div>
  );
}
