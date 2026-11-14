import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-600.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@fontsource/nunito/latin-900.css";
import {
  canAfford,
  choose,
  formatChange,
  levels,
  newGame,
  retry,
  sources,
  type Game,
  type Resource,
} from "./engine";
import Astro, { type AstroMood } from "./Astro";
import { playCue } from "./audio";
import AstroGuide from "./AstroGuide";
import MissionChoices from "./MissionChoices";
import { badges, earnedBadges } from "./badges";
import Arcade, { arcadeLevels } from "./Arcade";
import GameIcon from "./GameIcon";
import AstroChat from "./AstroChat";
import "./style.css";
import "./extra.css";
import "./redesign.css";
import "./arcade.css";
import "./chat.css";
import "./xp.css";

type Page =
  | "welcome"
  | "map"
  | "intro"
  | "mission"
  | "consequence"
  | "debrief"
  | "arcade"
  | "notebook"
  | "badges"
  | "settings"
  | "credits";
type Save = {
  unlocked: number;
  stars: Record<number, number>;
  xp: number;
  history: { level: number; choice: string; turn: number }[];
  lastDay?: string;
  days: number;
  insights?: Record<number, boolean>;
  best?: Record<number, Partial<Record<Resource, number>>>;
  arcadeStars?: Record<number, number>;
  arcadeProgress?: Record<number, string[]>;
  streak?: number;
  scienceProgress?: Record<number, number[]>;
};
type Settings = {
  age: "younger" | "older";
  largeText: boolean;
  motion: boolean;
  sound: boolean;
};
const defaultSave: Save = {
  unlocked: 1,
  stars: {},
  xp: 0,
  history: [],
  days: 0,
  insights: {},
  best: {},
  arcadeStars: {},
  arcadeProgress: {},
  streak: 0,
  scienceProgress: {},
};
const defaultSettings: Settings = {
  age: "older",
  largeText: false,
  motion: true,
  sound: true,
};
function practiceFields(save: Save): Pick<Save, "lastDay" | "days" | "streak"> {
  const today = new Date().toLocaleDateString("en-CA");
  if (save.lastDay === today)
    return { lastDay: today, days: save.days, streak: save.streak || 1 };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const consecutive = save.lastDay === yesterday.toLocaleDateString("en-CA");
  return {
    lastDay: today,
    days: save.days + 1,
    streak: consecutive ? (save.streak || 1) + 1 : 1,
  };
}
const labels: Record<Resource, string> = {
  air: "Air",
  power: "Power",
  safety: "Crew safety",
  food: "Food",
  water: "Water",
};
const symbols: Record<string, string> = {
  air: "◌",
  power: "ϟ",
  safety: "⬡",
  food: "✿",
  water: "◈",
  scan: "⌕",
  message: "✉",
};
function Scene({ level, turn }: { level: number; turn: number }) {
  return (
    <div
      className={`scene scene-${level}`}
      role="img"
      aria-label={
        level === 1
          ? "Moon habitat, air recycler, battery and scanner"
          : level === 2
            ? "Moon habitat and shielded shelter under a solar weather sky"
            : "Sealed grow box in the Moon habitat"
      }
    >
      <div className="scene-stars">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="scene-orb">{level === 2 ? "☼" : "✦"}</div>
      <div className="scene-hills" />
      <div className="scene-ground" />
      <div className="scene-building">
        <div className="scene-window">{level === 3 ? "✿" : "◌"}</div>
        <div className="scene-door" />
      </div>
      <div className="scene-dome" />
      <div className="scene-dish" />
      <div className="scene-array">
        <span />
        <span />
        <span />
      </div>
      <Astro
        mood={level === 1 ? "point" : level === 2 ? "concerned" : "think"}
        small
      />
      <div className="scene-caption">
        {level === 1
          ? "Life support bay"
          : level === 2
            ? "Shelter & survey zone"
            : "Controlled grow habitat"}{" "}
        · shift {turn}
      </div>
    </div>
  );
}
function ResourceBar({ name, value }: { name: Resource; value: number }) {
  return (
    <div className="resource">
      <div className="resource-top">
        <span>
          <b className="resource-icon">{symbols[name]}</b>
          {labels[name]}
        </span>
        <strong>
          {value}
          <small> / 100</small>
        </strong>
      </div>
      <div className="track">
        <span
          className={value < 25 ? "critical" : value < 45 ? "low" : ""}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
function SourceCard({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const source = sources.find((s) => s.id === id)!;
  return (
    <div className="source-card">
      <span className="eyebrow">REAL SCIENCE · ARCHIVED</span>
      <h3>{source.title}</h3>
      <p>{source.fact}</p>
      {!compact && <p className="source-limit">{source.limits}</p>}
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.agency} · source record ↗
      </a>
      {!compact && (
        <small>
          Record: {source.record}
          <br />
          Date: {source.eventAt} · Retrieved: {source.retrievedAt}
        </small>
      )}
    </div>
  );
}
function App() {
  const [save, setSave] = useState<Save>(() => ({ ...defaultSave }));
  const [settings, setSettings] = useState<Settings>(() => ({ ...defaultSettings }));
  const [page, setPage] = useState<Page>("welcome");
  const [displayXp, setDisplayXp] = useState(0);
  const [xpFlight, setXpFlight] = useState<{
    id: number; delta: number; x: number; y: number; dx: number; dy: number;
  } | null>(null);
  const lastXp = useRef(0);
  const [levelId, setLevelId] = useState(1);
  const [game, setGame] = useState<Game>(() => newGame(1));
  const [selected, setSelected] = useState<string | null>(null);
  const [resultText, setResultText] = useState("");
  const [reflection, setReflection] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [showScience, setShowScience] = useState(false);
  const [notice, setNotice] = useState("");
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [viewBadge, setViewBadge] = useState<string | null>(null);
  const [arcadeId, setArcadeId] = useState(1);
  const [arcadeRun, setArcadeRun] = useState(0);
  const [screenFlash, setScreenFlash] = useState<{
    kind: "good" | "bad";
    message: string;
    id: number;
  } | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );
  const flash = (kind: "good" | "bad", message: string) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setScreenFlash({ kind, message, id: Date.now() });
    flashTimer.current = setTimeout(
      () => setScreenFlash(null),
      kind === "bad" ? 950 : 800,
    );
  };
  const level = levels[levelId - 1];
  const guideByPage: Partial<
    Record<Page, { mood: AstroMood; message: string; hint: string }>
  > = {
    map: {
      mood: "point",
      message:
        "Pick any of the five rescue games. Each one teaches a new way to save the crew.",
      hint: "All five rescue levels are open. The science missions below tell longer stories.",
    },
    notebook: {
      mood: "think",
      message:
        "Here are the words and decisions you met on the Moon. Pick a source to explore the real science.",
      hint: "Look for a choice you made, then ask what happened later.",
    },
    badges: {
      mood: "celebrate",
      message:
        "Badges show the skills you practiced. Finish missions to collect them.",
      hint: "Stars improve when you protect resources and explain your plan.",
    },
    settings: {
      mood: "explain",
      message:
        "Make the game comfortable for you. Try sound, larger text, or gentler motion.",
      hint: "You can turn sound off at any time from the top bar.",
    },
    credits: {
      mood: "explain",
      message:
        "This shelf shows where the science came from. Our game points are just for practice.",
      hint: "Open an original source link to inspect the agency's record.",
    },
  };
  const missionGuide =
    game.levelId === 1
      ? {
          mood: selected ? "point" : "think",
          message: selected
            ? "Check the air and power cost. Then confirm your card."
            : "Choose one card. The air machine and scanner share a battery.",
          hint: "A scan gathers science, but power spent now cannot run the recycler at the same time.",
        }
      : game.levelId === 2
        ? {
            mood: selected ? "point" : "concerned",
            message: selected
              ? "Your plan is in place. Check the safety cost, then confirm."
              : "Drag a mission tile into the plan. A click works too.",
            hint: "Shelter and shielding cost power. Staying outside can cost safety later.",
          }
        : {
            mood: selected ? "point" : "think",
            message: selected
              ? "That answer has a cost. Check the food, water, and power chips."
              : "Read my question, then choose the answer card that fits your plan.",
            hint: "Crops take time. The crew still eats before the harvest arrives.",
          };
  useEffect(() => {
    // Remove data left by earlier MVP builds; this build keeps the run in memory.
    try {
      localStorage.removeItem("astro-save-v1");
      localStorage.removeItem("astro-settings-v1");
    } catch { /* Storage may be unavailable. */ }
  }, []);
  useEffect(() => {
    if (save.xp < lastXp.current) {
      lastXp.current = save.xp;
      setDisplayXp(save.xp);
      setXpFlight(null);
      return;
    }
    if (save.xp === lastXp.current) return;
    const delta = save.xp - displayXp;
    lastXp.current = save.xp;
    const target = document.querySelector(".xp-hud-total")?.getBoundingClientRect();
    const source = (document.activeElement?.closest("main") ? document.activeElement : null)
      || document.querySelector(".arcade-main, .choice-panel, .debrief-top, main");
    const origin = source?.getBoundingClientRect();
    const x = origin ? origin.left + origin.width / 2 : innerWidth / 2;
    const y = origin ? origin.top + Math.min(origin.height / 2, 280) : innerHeight / 2;
    setXpFlight({ id: Date.now(), delta, x, y,
      dx: (target?.left ?? innerWidth - 220) - x + (target?.width ?? 80) / 2,
      dy: (target?.top ?? 110) - y + (target?.height ?? 30) / 2,
    });
    const timer = setTimeout(() => {
      setDisplayXp(save.xp);
      setXpFlight(null);
      playCue("xp", settings.sound);
    }, settings.motion ? 950 : 80);
    return () => clearTimeout(timer);
  }, [save.xp]);
  useEffect(() => {
    if (page === "consequence" || showScience || viewBadge) {
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLButtonElement>(
            ".overlay .primary, .overlay .close",
          )
          ?.focus(),
      );
    }
  }, [page, showScience, viewBadge]);
  const go = (next: Page) => {
    setPage(next);
    setNotice("");
    setShowScience(false);
    window.scrollTo(0, 0);
  };
  const openLevel = (id: number) => {
    if (id > save.unlocked) return;
    setLevelId(id);
    setGame(newGame(id));
    setSelected(null);
    setReflection(null);
    setPrediction(null);
    go("intro");
  };
  const openArcade = (id: number) => {
    setArcadeId(id);
    setArcadeRun((run) => run + 1);
    go("arcade");
  };
  const winArcade = () => {
    setSave((current) =>
      current.arcadeStars?.[arcadeId]
        ? current
        : {
            ...current,
            arcadeStars: { ...current.arcadeStars, [arcadeId]: 3 },
            xp: current.xp + 30,
            ...practiceFields(current),
          },
    );
  };
  const progressArcade = (key: string, points: number) => {
    setSave((current) => {
      const previous = current.arcadeProgress?.[arcadeId] || [];
      if (previous.includes(key)) return current;
      return {
        ...current,
        arcadeProgress: {
          ...current.arcadeProgress,
          [arcadeId]: [...previous, key],
        },
        xp: current.xp + points,
        ...practiceFields(current),
      };
    });
  };
  const start = (challenge = false) => {
    setGame(newGame(levelId, challenge));
    setSelected(null);
    setPrediction(null);
    go("mission");
  };
  const options = level.choices[game.turn - 1] || [];
  const visibleOptions =
    settings.age === "younger" ? options.slice(0, 2) : options;
  const pickChoice = (id: string, method: "tap" | "drop") => {
    setSelected(id);
    setNotice("");
    playCue(method === "drop" ? "drop" : "pick", settings.sound);
  };
  const answerPrediction = (answer: number) => {
    if (prediction !== null) return;
    setPrediction(answer);
    if (answer === 0) {
      playCue("insight", settings.sound);
      flash("good", "+5 · Insight earned!");
      setSave((current) =>
        current.insights?.[levelId]
          ? current
          : {
              ...current,
              insights: { ...current.insights, [levelId]: true },
              xp: current.xp + 5,
            },
      );
    } else {
      playCue("retry", settings.sound);
      flash("bad", "Try another prediction");
    }
  };
  function confirm() {
    const choice = options.find((c) => c.id === selected);
    if (!choice) return;
    const short = canAfford(game, choice);
    if (short) {
      setNotice(`Not enough ${short}. Pick another action with a lower cost.`);
      flash("bad", `Not enough ${short}`);
      return;
    }
    const next = choose(game, choice);
    const entries = next.history.slice(game.history.length);
    setResultText(
      entries
        .map((e) =>
          e.kind === "choice"
            ? `Now: ${formatChange(e.changes)}.`
            : `Later: ${e.detail} ${formatChange(e.changes)}.`,
        )
        .join(" "),
    );
    setGame(next);
    setSelected(null);
    setNotice("");
    go("consequence");
    playCue(
      next.status === "complete"
        ? "success"
        : next.status === "failed"
          ? "retry"
          : "reveal",
      settings.sound,
    );
    flash(
      next.status === "failed" ? "bad" : "good",
      next.status === "failed"
        ? "Let's revise the plan"
        : next.status === "complete"
          ? "Mission complete!"
          : "+2 · Shift planned!",
    );
    setSave((s) => ({
      ...s,
      xp:
        s.xp +
        (next.status !== "failed" &&
        !s.scienceProgress?.[levelId]?.includes(game.turn)
          ? 2
          : 0),
      scienceProgress:
        next.status === "failed"
          ? s.scienceProgress
          : {
              ...s.scienceProgress,
              [levelId]: [
                ...(s.scienceProgress?.[levelId] || []),
                game.turn,
              ].filter(
                (value, index, values) => values.indexOf(value) === index,
              ),
            },
      ...(next.status === "failed" ? {} : practiceFields(s)),
      history: [
        ...s.history,
        { level: levelId, choice: choice.label, turn: game.turn },
      ].slice(-40),
    }));
  }
  function continueAfter() {
    if (game.status === "failed") {
      go("mission");
    } else if (game.status === "complete") {
      go("debrief");
    } else go("mission");
  }
  function finish(answer: number) {
    if (reflection !== null) return;
    setReflection(answer);
    playCue(
      answer === level.reflection.correct ? "success" : "retry",
      settings.sound,
    );
    flash(
      answer === level.reflection.correct ? "good" : "bad",
      answer === level.reflection.correct
        ? "Great explanation!"
        : "Review the cause and try again next time",
    );
    const stars =
      1 +
      (Math.min(game.values.air, game.values.power, game.values.safety) >= 40
        ? 1
        : 0) +
      (answer === level.reflection.correct ? 1 : 0);
    const improved = Math.max(stars, save.stars[levelId] || 0);
    const previousBest = save.best?.[levelId] || {};
    const best = Object.fromEntries(
      (Object.keys(game.values) as Resource[]).map((key) => [
        key,
        Math.max(previousBest[key] || 0, game.values[key]),
      ]),
    ) as Partial<Record<Resource, number>>;
    const updated: Save = {
      ...save,
      unlocked: Math.max(save.unlocked, Math.min(3, levelId + 1)),
      stars: { ...save.stars, [levelId]: improved },
      best: { ...save.best, [levelId]: best },
      xp:
        save.xp +
        (save.stars[levelId]
          ? Math.max(0, (improved - (save.stars[levelId] || 0)) * 10)
          : 20 + (answer === level.reflection.correct ? 10 : 0)),
      ...practiceFields(save),
    };
    setNewBadges(
      earnedBadges(updated)
        .filter((badge) => !badge.earned(save))
        .map((badge) => badge.id),
    );
    setSave(updated);
  }
  const nav = [
    ["map", "Mission map", "map"],
    ["notebook", "Astro's notebook", "book"],
    ["badges", "Badges", "badge"],
    ["settings", "Settings", "settings"],
    ["credits", "Data & credits", "source"],
  ] as const;
  const activeBadge = badges.find((badge) => badge.id === viewBadge);
  return (
    <div
      className={`app ${settings.largeText ? "large-text" : ""} ${settings.motion ? "" : "reduce-motion"}`}
    >
      <div className="desktop-message">
        <Astro small />
        <h1>Make room for your mission</h1>
        <p>ASTRO is designed for a desktop window at least 1000 pixels wide.</p>
      </div>
      <div className="main-wrap">
        <header className="topbar">
          <button
            className="brand brand-horizontal"
            onClick={() => go("map")}
            aria-label="ASTRO home"
          >
            <Astro mood="wave" small />
            <span>
              ASTRO<small>MISSION MOON</small>
            </span>
          </button>
          <nav className="header-nav" aria-label="Main navigation">
            {nav.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => go(id as Page)}
                className={page === id ? "active" : ""}
                aria-label={label}
              >
                <GameIcon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="top-stats">
            <button
              className="sound-toggle"
              type="button"
              aria-label={
                settings.sound ? "Mute sound effects" : "Turn on sound effects"
              }
              aria-pressed={settings.sound}
              onClick={() => {
                const next = !settings.sound;
                setSettings({ ...settings, sound: next });
                playCue("insight", next);
              }}
            >
              {settings.sound ? "♪ Sound on" : "♪ Sound off"}
            </button>
            <span className="streak-chip">{save.streak || 0} day streak</span>
          </div>
        </header>
        <div className="xp-hud" aria-label="Mission experience">
          <div className="xp-hud-icon"><GameIcon name="spark" /></div>
          <div className="xp-hud-copy"><strong>MISSION XP</strong><span>Level {Math.floor(displayXp / 100) + 1} · Keep helping the crew!</span></div>
          <div className="xp-hud-track" role="progressbar" aria-label="XP toward next level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={displayXp % 100}>
            <div className="xp-hud-fill" style={{ width: `${displayXp % 100}%` }} />
          </div>
          <strong className="xp-hud-total" aria-live="polite">{displayXp} XP</strong>
          {xpFlight && <span className="xp-hud-plus">+{xpFlight.delta}</span>}
        </div>
        <main>
          {guideByPage[page] && (
            <AstroGuide
              key={page}
              {...guideByPage[page]!}
              onHint={() => playCue("tap", settings.sound)}
            />
          )}
          {page === "welcome" && (
            <div className="welcome">
              <div className="welcome-copy">
                <span className="welcome-kicker">ASTRO'S MOON MISSIONS</span>
                <h1>
                  Small choices.
                  <br />
                  <em>Big Moon missions.</em>
                </h1>
                <p>
                  Help Astro protect the crew. Make a plan, see what changes,
                  and discover real space science.
                </p>
                <button className="primary" onClick={() => go("map")}>
                  Start mission <span>→</span>
                </button>
              </div>
              <div className="welcome-astro">
                <Astro mood="wave" />
                <div className="bubble">I'll guide every step!</div>
              </div>
            </div>
          )}
          {page === "map" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow turquoise">
                    YOUR LEARNING JOURNEY
                  </span>
                  <h1>Mission map</h1>
                  <p>
                    Five rescue games are ready to play. Solve pictures,
                    puzzles, routes, and matches to save the crew.
                  </p>
                </div>
                <div className="progress-ring">
                  <strong>
                    {Object.keys(save.arcadeStars || {}).length}
                    <small>/5</small>
                  </strong>
                  <span>rescue games done</span>
                </div>
                <div className="map-score">
                  <strong>
                    ✧ {Object.keys(save.insights || {}).length} insights
                  </strong>
                  <span>
                    {save.streak || 0} day streak · {save.days} practice{" "}
                    {save.days === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
              <div className="arcade-map-grid">
                {arcadeLevels.map((item) => (
                  <button
                    key={item.id}
                    className={`arcade-map-card ${item.color}`}
                    onClick={() => openArcade(item.id)}
                  >
                    <span className="arcade-map-number">
                      LEVEL {item.id} · {item.kind}
                    </span>
                    <span className="arcade-map-art">
                      <GameIcon name={item.icon} />
                    </span>
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                    <span className="arcade-map-action">
                      {save.arcadeStars?.[item.id]
                        ? "★★★ · Replay"
                        : "PLAY NOW →"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="science-heading">
                <span className="eyebrow turquoise">MORE TO EXPLORE</span>
                <h2>Science story missions</h2>
                <p>
                  Make choices over several shifts and discover what changed.
                </p>
              </div>
              <div className="mission-path">
                {levels.map((item, i) => (
                  <button
                    className={`mission-node ${item.id > save.unlocked ? "locked" : ""}`}
                    key={item.id}
                    onClick={() => openLevel(item.id)}
                    disabled={item.id > save.unlocked}
                  >
                    <div className="node-number">
                      {save.stars[item.id]
                        ? "✓"
                        : item.id > save.unlocked
                          ? "—"
                          : `0${item.id}`}
                    </div>
                    <div>
                      <span className="eyebrow">{item.tag}</span>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <span className="format-pill">
                        {["PICK A CARD", "DRAG A PLAN", "ANSWER ASTRO"][i]}
                      </span>{" "}
                      <span className="node-action">
                        {save.stars[item.id]
                          ? `${"★".repeat(save.stars[item.id])}${"☆".repeat(3 - save.stars[item.id])} · Replay`
                          : item.id > save.unlocked
                            ? "Complete the previous mission"
                            : "Start mission →"}
                      </span>
                    </div>
                    <div className="node-art">
                      <GameIcon
                        name={(["air", "storm", "plant"] as const)[i]}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {page === "arcade" && (
            <Arcade
              key={`${arcadeId}-${arcadeRun}`}
              levelId={arcadeId}
              sound={settings.sound}
              done={!!save.arcadeStars?.[arcadeId]}
              onWin={winArcade}
              onProgress={progressArcade}
              onNext={() =>
                arcadeId === 5 ? go("map") : openArcade(arcadeId + 1)
              }
              onMap={() => go("map")}
            />
          )}
          {page === "intro" && (
            <div className="intro-grid">
              <div className="intro-main">
                <span className="eyebrow turquoise">
                  MISSION 0{level.id} · {level.tag}
                </span>
                <h1>{level.title}</h1>
                <p className="intro-summary">{level.summary}</p>
                <Scene level={level.id} turn={1} />
                <div className="goal">
                  <span>◎</span>
                  <div>
                    <strong>Your mission goal</strong>
                    <p>{level.goal}</p>
                  </div>
                </div>
                <button className="primary" onClick={() => start()}>
                  Start mission →
                </button>
              </div>
              <div className="intro-side">
                <AstroGuide
                  mood="explain"
                  message={
                    level.id === 1
                      ? "First, keep air flowing while collecting one scan."
                      : level.id === 2
                        ? "Next, protect the crew and still do some science."
                        : "Now, grow food without running out of water or power."
                  }
                  hint={level.goal}
                  onHint={() => playCue("tap", settings.sound)}
                />
                <h3>Words to know</h3>
                {level.terms.map(([term, definition]) => (
                  <div className="term" key={term}>
                    <strong>{term}</strong>
                    <p>{definition}</p>
                  </div>
                ))}
                <SourceCard id={level.source} compact />
              </div>
            </div>
          )}
          {(page === "mission" || page === "consequence") && (
            <>
              <div className="mission-title">
                <div>
                  <span className="eyebrow turquoise">
                    MISSION 0{level.id} · SHIFT {game.turn} OF {level.shifts}
                    {game.challenge ? " · CHALLENGE" : ""}
                  </span>
                  <h1>{level.title}</h1>
                  <p>
                    {game.turn === 1
                      ? level.summary
                      : game.turn === level.shifts
                        ? "Final shift: check your goal before choosing."
                        : "What matters most during this shift?"}
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setShowScience(true)}
                >
                  ⓘ Real science
                </button>
              </div>
              <div className="sim-grid">
                <section className="choice-panel">
                  <div className="panel-head">
                    <span className="step-dot">{game.turn}</span>
                    <div>
                      <span className="eyebrow">MAKE A DECISION</span>
                      <h2>
                        {game.turn === 1
                          ? "Choose your first action"
                          : "Choose this shift’s action"}
                      </h2>
                    </div>
                  </div>
                  {game.turn === 1 && prediction === null && (
                    <div className="predict">
                      <strong>Predict before you choose</strong>
                      <p>
                        {level.id === 1
                          ? "If we scan first, what might run short later?"
                          : level.id === 2
                            ? "If the crew stays outside, what could be at risk?"
                            : "What could run short before harvest?"}
                      </p>
                      <div>
                        {(level.id === 1
                          ? ["Air", "Decoration"]
                          : level.id === 2
                            ? ["Crew safety", "Food"]
                            : ["Water or power", "Stars"]
                        ).map((answer, i) => (
                          <button
                            key={answer}
                            onClick={() => answerPrediction(i)}
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {prediction !== null && game.turn === 1 && (
                    <p className="prediction-note">
                      {prediction === 0
                        ? "✧ Insight earned! Now see how your plan plays out."
                        : "Let’s test that idea with the resource gauges."}
                    </p>
                  )}
                  <MissionChoices
                    game={game}
                    choices={visibleOptions}
                    selected={selected}
                    onSelect={pickChoice}
                  />
                  {notice && (
                    <p className="notice" role="alert">
                      {notice}
                    </p>
                  )}
                  <button
                    className="primary confirm"
                    disabled={!selected}
                    onClick={confirm}
                  >
                    Confirm choice →
                  </button>
                  <small className="model-note">
                    Game model: simplified for learning. All resource numbers
                    are game points.
                  </small>
                </section>
                <section className="visual-panel">
                  <Scene level={level.id} turn={game.turn} />
                  <AstroGuide
                    key={`${level.id}-${game.turn}`}
                    mood={
                      prediction === 0 && game.turn === 1 && !selected
                        ? "celebrate"
                        : (missionGuide.mood as AstroMood)
                    }
                    message={missionGuide.message}
                    hint={missionGuide.hint}
                    compact
                    onHint={() => playCue("tap", settings.sound)}
                  />
                  <div className="timeline-mini">
                    <span className="eyebrow">MISSION SHIFTS</span>
                    <div>
                      {Array.from({ length: level.shifts }, (_, i) => (
                        <span
                          key={i}
                          className={i + 1 <= game.turn ? "done" : ""}
                        >
                          {i + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
                <aside className="status-panel">
                  <div className="status-card">
                    <div className="status-title">
                      <h2>Outpost status</h2>
                      <span>LIVE MODEL</span>
                    </div>
                    <ResourceBar name="air" value={game.values.air} />
                    <ResourceBar name="power" value={game.values.power} />
                    {game.values.power < (level.id === 3 ? 30 : 25) && (
                      <p className="power-alert" role="status">
                        Low power: plan the next shift carefully.
                      </p>
                    )}
                    <ResourceBar name="safety" value={game.values.safety} />
                    {level.id === 3 && (
                      <div className="inventory">
                        <span>
                          ✿ Food <strong>{game.values.food}</strong>
                        </span>
                        <span>
                          ◈ Water <strong>{game.values.water}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                  <SourceCard id={level.source} compact />
                  <div className="timeline-card">
                    <span className="eyebrow">LATEST CHANGE</span>
                    <p>
                      {game.history.at(-1)?.detail ||
                        "Your mission starts here."}
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
          {page === "debrief" && (
            <div className="debrief">
              <div className="debrief-top">
                <Astro
                  mood={
                    reflection === null
                      ? "think"
                      : reflection === level.reflection.correct
                        ? "celebrate"
                        : "explain"
                  }
                />
                <div>
                  <span className="eyebrow turquoise">MISSION COMPLETE</span>
                  <h1>You kept the crew going!</h1>
                  <p>Answer Astro's question, then explore another strategy.</p>
                  <div className="stars">
                    {"★".repeat(
                      reflection === null ? 1 : save.stars[levelId] || 1,
                    )}
                    {"☆".repeat(
                      3 - (reflection === null ? 1 : save.stars[levelId] || 1),
                    )}
                  </div>
                </div>
              </div>
              {newBadges.length > 0 && reflection !== null && (
                <div className="badge-awards" role="status" aria-live="polite">
                  <div>
                    <span className="eyebrow">NEW MISSION REWARDS</span>
                    <h2>
                      {newBadges.length === 1
                        ? "A new badge is yours!"
                        : `${newBadges.length} new badges are yours!`}
                    </h2>
                  </div>
                  <div className="badge-awards-list">
                    {newBadges.map((id, index) => {
                      const badge = badges.find((item) => item.id === id)!;
                      return (
                        <img
                          key={id}
                          src={badge.image}
                          alt={`${badge.title} badge earned`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="debrief-grid">
                <section className="paper">
                  <span className="eyebrow">MISSION REPLAY WITH EVIDENCE</span>
                  <h2>What happened, shift by shift</h2>
                  <div className="history">
                    {game.history.map((entry, i) => (
                      <div className="history-row" key={i}>
                        <span className="history-turn">{entry.turn}</span>
                        <div>
                          <strong>{entry.title}</strong>
                          <p>{entry.detail}</p>
                          <small>{formatChange(entry.changes)}</small>
                          <div className="history-values">
                            {(Object.keys(entry.changes) as Resource[])
                              .filter((key) => entry.changes[key] !== 0)
                              .map((key) => (
                                <span key={key}>
                                  {labels[key]}: {entry.before[key]} →{" "}
                                  {entry.after[key]}
                                </span>
                              ))}
                          </div>
                        </div>
                        <span className="history-kind">
                          {entry.kind === "event" ? "LATER" : "CHOICE"}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="debrief-side">
                  <div className="paper">
                    <span className="eyebrow">THINK IT THROUGH</span>
                    <h2>{level.reflection.question}</h2>
                    {level.reflection.answers.map((answer, i) => (
                      <button
                        className={`answer ${reflection === i ? "picked" : ""}`}
                        key={answer}
                        onClick={() => finish(i)}
                        disabled={reflection !== null}
                      >
                        {answer}
                      </button>
                    ))}
                    {reflection !== null && (
                      <p className="answer-feedback">
                        {reflection === level.reflection.correct
                          ? "Nice reasoning!"
                          : "Good try. Here is the connection:"}{" "}
                        {level.reflection.explain}
                      </p>
                    )}
                  </div>
                  <SourceCard id={level.source} />
                  <div className="debrief-actions">
                    <button
                      className="primary"
                      onClick={() => {
                        setGame(retry(game));
                        setSelected(null);
                        setReflection(null);
                        go("mission");
                      }}
                    >
                      Revisit last shift ↻
                    </button>
                    <button
                      className="secondary"
                      onClick={() => {
                        setGame(newGame(levelId, true));
                        setSelected(null);
                        setReflection(null);
                        setPrediction(null);
                        go("mission");
                      }}
                    >
                      Challenge replay
                    </button>
                    <button
                      className="secondary"
                      onClick={() =>
                        levelId < 3 && save.unlocked > levelId
                          ? openLevel(levelId + 1)
                          : go("map")
                      }
                    >
                      {levelId < 3 && save.unlocked > levelId
                        ? "Next mission →"
                        : "Mission map →"}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
          {page === "notebook" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow turquoise">LEARN & REMEMBER</span>
                  <h1>Astro’s notebook</h1>
                  <p>
                    Quick reminders from your missions and the evidence behind
                    them.
                  </p>
                </div>
                <Astro small />
              </div>
              <div className="notebook-grid">
                <section className="paper">
                  <h2>Words from the Moon</h2>
                  {levels
                    .flatMap((l) => l.terms)
                    .map(([term, definition]) => (
                      <div className="term" key={term}>
                        <strong>{term}</strong>
                        <p>{definition}</p>
                      </div>
                    ))}
                </section>
                <section className="paper">
                  <h2>Your recent decisions</h2>
                  {save.history.length ? (
                    save.history
                      .slice(-12)
                      .reverse()
                      .map((item, i) => (
                        <div className="decision" key={i}>
                          <span>
                            Shift {item.turn} · Mission {item.level}
                          </span>
                          <strong>{item.choice}</strong>
                        </div>
                      ))
                  ) : (
                    <p>Play a mission to collect your decision notes.</p>
                  )}
                  <h2>Review cards</h2>
                  {levels.map((l) => (
                    <div className="review" key={l.id}>
                      <strong>{l.reflection.question}</strong>
                      <p>{l.reflection.explain}</p>
                    </div>
                  ))}
                </section>
                <section className="paper">
                  <h2>Real science shelf</h2>
                  {sources.map((s) => (
                    <SourceCard key={s.id} id={s.id} compact />
                  ))}
                </section>
              </div>
              <section className="paper astro-gallery">
                <div>
                  <span className="eyebrow turquoise">YOUR MISSION GUIDE</span>
                  <h2>Astro has many moods</h2>
                  <p>
                    Every expression is a little clue about what comes next.
                  </p>
                </div>
                <div className="astro-gallery-grid">
                  {(
                    [
                      "wave",
                      "point",
                      "think",
                      "celebrate",
                      "concerned",
                      "explain",
                      "sleep",
                      "idle",
                    ] as AstroMood[]
                  ).map((mood) => (
                    <div key={mood}>
                      <Astro mood={mood} small />
                      <strong>{mood}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
          {page === "badges" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow turquoise">
                    SKILLS YOU PRACTICED
                  </span>
                  <h1>Badges</h1>
                  <p>
                    {earnedBadges(save).length} of 10 badges unlocked. Each one
                    celebrates a skill you practiced.
                  </p>
                </div>
              </div>
              <div className="badge-grid">
                {badges.map((badge, index) => (
                  <button
                    key={badge.id}
                    className={`badge-card ${badge.earned(save) ? "earned" : "locked"}`}
                    style={{ animationDelay: `${index * 45}ms` }}
                    onClick={() => {
                      setViewBadge(badge.id);
                      playCue("tap", settings.sound);
                    }}
                    aria-label={`View ${badge.title} badge. ${badge.earned(save) ? "Earned" : "Locked"}. ${badge.criterion}`}
                  >
                    <span className="badge-image-wrap">
                      <img src={badge.image} alt="" loading="lazy" />
                    </span>
                    <span className="badge-state">
                      {badge.earned(save) ? "✓ EARNED" : "◌ TO EARN"}
                    </span>
                    <span className="badge-description">
                      {badge.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {page === "settings" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow turquoise">MAKE IT YOURS</span>
                  <h1>Settings</h1>
                  <p>Choose the reading and motion style that works for you.</p>
                </div>
              </div>
              <div className="settings-list paper">
                <label>
                  <span>
                    <strong>Age mode</strong>
                    <small>Show two or three action cards at once.</small>
                  </span>
                  <select
                    value={settings.age}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        age: e.target.value as Settings["age"],
                      })
                    }
                  >
                    <option value="younger">Ages 7–9 · two choices</option>
                    <option value="older">Ages 10–12 · three choices</option>
                  </select>
                </label>
                <label>
                  <span>
                    <strong>Large text</strong>
                    <small>Make reading text a little bigger.</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.largeText}
                    onChange={(e) =>
                      setSettings({ ...settings, largeText: e.target.checked })
                    }
                  />
                </label>
                <label>
                  <span>
                    <strong>Gentle motion</strong>
                    <small>Turn decorative animation on or off.</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.motion}
                    onChange={(e) =>
                      setSettings({ ...settings, motion: e.target.checked })
                    }
                  />
                </label>
                <label>
                  <span>
                    <strong>Sound</strong>
                    <small>
                      Play soft tones for choices and mission results.
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSettings({ ...settings, sound: enabled });
                      playCue("insight", enabled);
                    }}
                  />
                </label>
                <button className="danger" onClick={() => window.location.reload()}>
                  Restart this session
                </button>
              </div>
            </>
          )}
          {page === "credits" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow turquoise">
                    HOW THIS GAME USES DATA
                  </span>
                  <h1>Data & credits</h1>
                  <p>
                    Real source records inspire the constraints. The mission
                    points are a simplified model.
                  </p>
                </div>
              </div>
              <div className="credits-grid">
                <div className="paper">
                  <h2>Evidence records</h2>
                  {sources.map((s) => (
                    <div className="credit-record" key={s.id}>
                      <h3>{s.title}</h3>
                      <p>{s.fact}</p>
                      <p>
                        <strong>Context:</strong> {s.limits}
                      </p>
                      <dl>
                        <dt>Agency</dt>
                        <dd>{s.agency}</dd>
                        <dt>Record</dt>
                        <dd>{s.record}</dd>
                        <dt>Date</dt>
                        <dd>{s.eventAt}</dd>
                        <dt>Retrieved</dt>
                        <dd>{s.retrievedAt}</dd>
                        <dt>Location</dt>
                        <dd>{s.location}</dd>
                        <dt>Units</dt>
                        <dd>{s.units}</dd>
                        <dt>Rights</dt>
                        <dd>{s.licenseNote}</dd>
                        <dt>Review</dt>
                        <dd>{s.reviewedAt}</dd>
                      </dl>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        Open original source ↗
                      </a>
                    </div>
                  ))}
                </div>
                <div className="paper">
                  <h2>About the model</h2>
                  <p>
                    Air, power, safety, food, and water values are illustrative
                    mission points. They are not NASA or CSA measurements. The
                    DONKI solar flare does not establish a radiation dose at a
                    Moon base.
                  </p>
                  <p>
                    All illustrations and the Astro mascot are original SVG or
                    CSS artwork created for this prototype. No NASA, CSA, or
                    Duolingo image or logo is reused.
                  </p>
                  <p>
                    This is an independent educational project. NASA does not
                    endorse any non-U.S. Government entity and is not
                    responsible for information on non-U.S. Government websites.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
        <footer>
          ASTRO · Mission Moon{" "}
          <span>
            Independent educational prototype ·{" "}
            <button onClick={() => go("credits")}>Sources & credits</button>
          </span>
        </footer>
      </div>
      {page === "consequence" && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consequence-title"
        >
          <div className="modal">
            <Astro
              mood={
                game.status === "failed"
                  ? "concerned"
                  : game.status === "complete"
                    ? "celebrate"
                    : "explain"
              }
            />
            <span className="eyebrow turquoise">
              {game.status === "failed"
                ? "LET’S TRY AGAIN"
                : game.status === "complete"
                  ? "MISSION GOAL REACHED"
                  : "SHIFT REPORT"}
            </span>
            <h2 id="consequence-title">
              {game.status === "failed"
                ? game.failure
                : game.status === "complete"
                  ? "Great planning!"
                  : "Your choice changed the base"}
            </h2>
            <p>{resultText}</p>
            <p className="astro-result-guide">
              {game.status === "failed"
                ? "Let's try this shift again. Look at the cost before confirming."
                : game.status === "complete"
                  ? "You did it! Look back at what happened now and later."
                  : "See what changed? Keep that in mind for the next shift."}
            </p>
            {game.status === "failed" ? (
              <div className="modal-actions">
                <button
                  className="primary"
                  onClick={() => {
                    setGame(retry(game));
                    go("mission");
                  }}
                >
                  Retry this shift ↻
                </button>
                <button className="secondary" onClick={() => start()}>
                  Restart level
                </button>
              </div>
            ) : (
              <button className="primary" onClick={continueAfter}>
                {game.status === "complete"
                  ? "See mission replay →"
                  : "Continue →"}
              </button>
            )}
            <small>Game model: simplified for learning.</small>
          </div>
        </div>
      )}
      {showScience && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="science-title"
        >
          <div className="modal science-modal">
            <button
              className="close"
              onClick={() => setShowScience(false)}
              aria-label="Close science drawer"
            >
              ×
            </button>
            <span className="eyebrow turquoise">EVIDENCE DRAWER</span>
            <h2 id="science-title">Real science, clear limits</h2>
            <SourceCard id={level.source} />
            {level.id === 2 && <SourceCard id="shelter" />}
            <p className="model-note">
              All mission resource numbers are invented game points. Archived
              records are available offline.
            </p>
          </div>
        </div>
      )}
      {activeBadge && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-detail-title"
        >
          <div className="modal badge-detail">
            <button
              className="close"
              onClick={() => setViewBadge(null)}
              aria-label="Close badge details"
            >
              ×
            </button>
            <img src={activeBadge.image} alt="" />
            <div>
              <span className="eyebrow turquoise">
                {activeBadge.earned(save) ? "BADGE EARNED" : "BADGE TO EARN"}
              </span>
              <h2 id="badge-detail-title">{activeBadge.title}</h2>
              <p>{activeBadge.description}</p>
              <strong>{activeBadge.criterion}</strong>
              <button className="primary" onClick={() => setViewBadge(null)}>
                Back to badges
              </button>
            </div>
          </div>
        </div>
      )}
      {screenFlash && (
        <div
          key={screenFlash.id}
          className={`feedback-screen ${screenFlash.kind}`}
          aria-hidden="true"
        >
          <div className="feedback-burst">
            <GameIcon name={screenFlash.kind === "good" ? "spark" : "shield"} />
            <strong>{screenFlash.message}</strong>
            {screenFlash.kind === "good" && (
              <span className="feedback-particles">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
        </div>
      )}
      {xpFlight && <div key={xpFlight.id} className="xp-flight" aria-hidden="true"
        style={{ left: xpFlight.x, top: xpFlight.y, "--fly-x": `${xpFlight.dx}px`, "--fly-y": `${xpFlight.dy}px` } as React.CSSProperties}>
        <GameIcon name="spark" /><i /><i /><i /><i /><span>+{xpFlight.delta}</span>
      </div>}
      <AstroChat
        sound={settings.sound}
        context={{
          page,
          arcadeId,
          levelId,
          turn: game.turn,
          xp: save.xp,
          streak: save.streak || 0,
          arcadeDone: Object.keys(save.arcadeStars || {}).length,
          scienceDone: Object.keys(save.stars).length,
          badges: earnedBadges(save).length,
        }}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
