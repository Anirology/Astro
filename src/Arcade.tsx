import { useEffect, useRef, useState } from "react";
import Astro from "./Astro";
import { playCue } from "./audio";
import GameIcon, { type IconName } from "./GameIcon";
import { arcadeQuestions } from "./arcadeQuestions";

export const arcadeLevels = [
  {
    id: 1,
    title: "Airlock rescue",
    kind: "DRAG & DROP",
    icon: "astronaut",
    color: "coral",
    summary: "Match the right gear to an astronaut outside the habitat.",
  },
  {
    id: 2,
    title: "Supply grid",
    kind: "LOGIC GRID",
    icon: "grid",
    color: "gold",
    summary: "Give each row, column, and small square one of every supply.",
  },
  {
    id: 3,
    title: "Rover route",
    kind: "ARROW SIMULATOR",
    icon: "rover",
    color: "blue",
    summary: "Drive around rocks, collect oxygen, and reach your crewmate.",
  },
  {
    id: 4,
    title: "Power match",
    kind: "MATCH 3",
    icon: "crystal",
    color: "mint",
    summary: "Swap neighboring supply gems to make three matching ones.",
  },
  {
    id: 5,
    title: "Storm rescue",
    kind: "SCENARIO DRAG & DROP",
    icon: "storm",
    color: "purple",
    summary: "Prepare three safe places before the solar storm arrives.",
  },
] as const;

type Props = {
  levelId: number;
  sound: boolean;
  done: boolean;
  onWin: () => void;
  onNext: () => void;
  onMap: () => void;
  onProgress: (key: string, points: number) => void;
};
type Effects = {
  onStep: (key: string, points: number) => void;
  onFeedback: (kind: "good" | "bad", message: string) => void;
};
type Gear = { id: string; icon: IconName; name: string; target: string; lesson: string; hint: string };
const airlockGear: Gear[] = [
  { id: "oxygen", icon: "air", name: "Oxygen pack", target: "Astronaut", lesson: "A space suit carries oxygen so its wearer can breathe outside.", hint: "The astronaut needs breathing support outside." },
  { id: "battery", icon: "power", name: "Power cell", target: "Rover", lesson: "The rover needs electricity to move supplies.", hint: "Which machine moves using electrical power?" },
  { id: "seal", icon: "shield", name: "Door seal", target: "Airlock", lesson: "A closed seal helps keep the habitat's air inside.", hint: "Which doorway must stay sealed around the habitat air?" },
];
const stormGear: Gear[] = [
  { id: "shield", icon: "shield", name: "Shield panel", target: "Shelter", lesson: "More material between the crew and outside particles can improve shielding.", hint: "Which place should have the extra shielding?" },
  { id: "radio", icon: "radio", name: "Radio link", target: "Crew", lesson: "The crew needs a way to hear and share the shelter plan.", hint: "Who needs to hear the shelter plan?" },
  { id: "charge", icon: "power", name: "Charge pack", target: "Habitat", lesson: "The habitat needs power to keep its systems working.", hint: "Which home for the crew needs working systems?" },
];

function Rescue({
  storm,
  sound,
  onWin,
  onStep,
  onFeedback,
}: {
  storm: boolean;
  sound: boolean;
  onWin: () => void;
} & Effects) {
  const gear = storm ? stormGear : airlockGear;
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Pick up a supply, then drop it on the right place.",
  );
  const place = (target: string, id = selected) => {
    if (!id || placed.includes(id)) return;
    const item = gear.find((g) => g.id === id)!;
    if (item.target !== target) {
      setMessage(`${item.name} belongs somewhere else. ${item.hint}`);
      playCue("retry", sound);
      onFeedback("bad", "Try another place");
      return;
    }
    const next = [...placed, id];
    setPlaced(next);
    setSelected(null);
    setMessage(`${item.name} secured! ${item.lesson}`);
    playCue("drop", sound);
    onStep(`gear-${id}`, 5);
    onFeedback("good", "+5 · Gear secured!");
    if (next.length === gear.length) onWin();
  };
  return (
    <div className={`rescue-scene ${storm ? "storm-scene" : "airlock-scene"}`}>
      <div className="scene-sun">
        <GameIcon name={storm ? "storm" : "spark"} />
      </div>
      <div className="scene-groundline" />
      <div className="rescue-topline">
        <span>
          {storm ? "SOLAR STORM APPROACHING" : "AIRLOCK SUPPLY ALERT"}
        </span>
        <strong>{placed.length} / 3 safe</strong>
      </div>
      <div className="rescue-targets">
        {gear.map((g, i) => (
          <button
            key={g.id}
            className={`rescue-target ${placed.includes(g.id) ? "filled" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              place(g.target, e.dataTransfer.getData("text/plain"));
            }}
            onClick={() => place(g.target)}
            aria-label={`${g.target} drop zone`}
          >
            <span className="target-picture">
              <GameIcon
                name={
                  storm
                    ? (["shelter", "astronaut", "habitat"] as IconName[])[i]
                    : (["astronaut", "rover", "habitat"] as IconName[])[i]
                }
              />
            </span>
            <strong>{g.target}</strong>
            <small>
              {placed.includes(g.id) ? `✓ ${g.name}` : "Drop gear here"}
            </small>
          </button>
        ))}
      </div>
      <div className="rescue-tray">
        <span className="eyebrow">SUPPLY TRAY</span>
        <div className="gear-list">
          {gear
            .filter((g) => !placed.includes(g.id))
            .map((g) => (
              <button
                key={g.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", g.id);
                  setSelected(g.id);
                }}
                className={`gear ${selected === g.id ? "selected" : ""}`}
                onClick={() => {
                  setSelected(g.id);
                  playCue("pick", sound);
                }}
              >
                <span>
                  <GameIcon name={g.icon} />
                </span>
                <strong>{g.name}</strong>
              </button>
            ))}
        </div>
      </div>
      <p className="game-message" role="status">
        {message}
      </p>
    </div>
  );
}

const answer = [
  "air",
  "power",
  "water",
  "shield",
  "water",
  "shield",
  "air",
  "power",
  "power",
  "air",
  "shield",
  "water",
  "shield",
  "water",
  "power",
  "air",
];
const given = new Set([0, 3, 5, 6, 9, 10, 12, 15]);
const symbols = ["air", "power", "water", "shield"];
const supplyLessons: Record<string, string> = {
  air: "Air systems manage oxygen and remove carbon dioxide from cabin air.",
  power: "Electrical power keeps equipment running.",
  water: "Collected cabin moisture can be cleaned and reused as water.",
  shield: "Shielding puts material between the crew and outside hazards.",
};
function validGrid(cells: string[]) {
  if (cells.some((cell) => !symbols.includes(cell))) return false;
  const complete = (indices: number[]) =>
    new Set(indices.map((i) => cells[i])).size === 4;
  for (let row = 0; row < 4; row++)
    if (!complete([0, 1, 2, 3].map((col) => row * 4 + col))) return false;
  for (let col = 0; col < 4; col++)
    if (!complete([0, 1, 2, 3].map((row) => row * 4 + col))) return false;
  for (let row = 0; row < 4; row += 2)
    for (let col = 0; col < 4; col += 2)
      if (
        !complete([
          row * 4 + col,
          row * 4 + col + 1,
          (row + 1) * 4 + col,
          (row + 1) * 4 + col + 1,
        ])
      )
        return false;
  return true;
}
function LogicGrid({
  sound,
  onWin,
  onStep,
  onFeedback,
}: { sound: boolean; onWin: () => void } & Effects) {
  const [cells, setCells] = useState(
    answer.map((v, i) => (given.has(i) ? v : "")),
  );
  const [pick, setPick] = useState(symbols[0]);
  const [message, setMessage] = useState(
    "Tap a symbol, then fill an empty square.",
  );
  const setCell = (i: number) => {
    if (given.has(i)) return;
    const next = [...cells];
    next[i] = next[i] === pick ? "" : pick;
    setCells(next);
    playCue("pick", sound);
    if (next[i] === answer[i]) {
      onStep(`cell-${i}`, 2);
      onFeedback("good", "+2 · Supply placed!");
    } else if (next[i]) onFeedback("bad", "Check that supply");
    if (validGrid(next)) {
      setMessage("Every supply has its place. Puzzle solved!");
      onWin();
    } else setMessage(next[i] === answer[i]
      ? `${supplyLessons[pick]} Each row, column, and 2×2 box needs all four.`
      : "A supply repeats or is missing. Check the row, column, and little box.");
  };
  const check = () => {
    const good = validGrid(cells);
    setMessage(
      good
        ? "Perfect supply plan!"
        : "A supply is missing or repeated. Look again.",
    );
    playCue(good ? "success" : "retry", sound);
    onFeedback(
      good ? "good" : "bad",
      good ? "Grid complete!" : "Check the grid",
    );
    if (good) onWin();
  };
  return (
    <div className="logic-game">
      <div className="logic-story">
        <span className="story-emoji">
          <GameIcon name="grid" />
        </span>
        <div>
          <strong>Pack the rescue lockers</strong>
          <p>
            One air, power, water, and shield in every row, column, and little
            box.
          </p>
        </div>
      </div>
      <div className="logic-board">
        {cells.map((v, i) => (
          <button
            key={i}
            className={`logic-cell ${given.has(i) ? "given" : ""} ${i % 4 === 1 ? "box-right" : ""} ${Math.floor(i / 4) === 1 ? "box-bottom" : ""}`}
            onClick={() => setCell(i)}
            aria-label={`Row ${Math.floor(i / 4) + 1} column ${(i % 4) + 1}: ${v || "empty"}`}
            disabled={given.has(i)}
          >
            {v && <GameIcon name={v as IconName} />}
          </button>
        ))}
      </div>
      <div className="symbol-picks">
        {symbols.map((v) => (
          <button
            key={v}
            className={pick === v ? "selected" : ""}
            onClick={() => setPick(v)}
            aria-label={`Select ${v} supply`}
          >
            <GameIcon name={v as IconName} />
          </button>
        ))}
      </div>
      <button className="secondary" onClick={check}>
        Check my grid
      </button>
      <p className="game-message" role="status">
        {message}
      </p>
    </div>
  );
}

const rocks = new Set([1, 6, 8, 13, 16, 18, 21]);
const oxygen = 10,
  friend = 24;
function Rover({
  sound,
  onWin,
  onStep,
  onFeedback,
}: { sound: boolean; onWin: () => void } & Effects) {
  const [position, setPosition] = useState(0),
    [hasOxygen, setHasOxygen] = useState(false),
    [message, setMessage] = useState(
      "Collect the oxygen pack, then reach the astronaut.",
    );
  const move = (dx: number, dy: number) => {
    const x = (position % 5) + dx,
      y = Math.floor(position / 5) + dy,
      next = y * 5 + x;
    if (x < 0 || x > 4 || y < 0 || y > 4 || rocks.has(next)) {
      setMessage("A rock blocks that route. Try another arrow.");
      playCue("retry", sound);
      onFeedback("bad", "Route blocked");
      return;
    }
    setPosition(next);
    playCue("step", sound);
    onStep(`route-${next}`, 1);
    if (next === oxygen) {
      setHasOxygen(true);
      setMessage("Oxygen collected! A space suit needs oxygen for breathing. Now reach the astronaut.");
      onStep("oxygen", 10);
      onFeedback("good", "+10 · Oxygen collected!");
    } else if (next === friend) {
      if (hasOxygen) {
        setMessage("Rescue complete!");
        onFeedback("good", "Crew reached!");
        onWin();
      } else {
      setMessage("Find the oxygen pack first. The astronaut needs breathing support outside.");
        onFeedback("bad", "Get oxygen first");
      }
    } else
      setMessage(
        `Rover moved. ${hasOxygen ? "Now reach the astronaut." : "Find the oxygen pack."}`,
      );
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const steps: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      if (!steps[event.key]) return;
      event.preventDefault();
      move(...steps[event.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="rover-game">
      <div className="rover-status">
        <span>Oxygen: {hasOxygen ? "on board ✓" : "still outside"}</span>
        <span>
          Rover at {Math.floor(position / 5) + 1}, {(position % 5) + 1}
        </span>
      </div>
      <div className="rover-board">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            className={`rover-cell ${rocks.has(i) ? "rock" : ""} ${i === position ? "here" : ""}`}
            key={i}
            aria-label={`Grid row ${Math.floor(i / 5) + 1} column ${(i % 5) + 1}`}
          >
            {i === position ? (
              <GameIcon name="rover" />
            ) : rocks.has(i) ? (
              <GameIcon name="rock" />
            ) : i === oxygen && !hasOxygen ? (
              <GameIcon name="air" />
            ) : i === friend ? (
              <GameIcon name="astronaut" />
            ) : (
              <span aria-hidden="true">·</span>
            )}
          </div>
        ))}
      </div>
      <div className="arrow-controls">
        <button onClick={() => move(0, -1)} aria-label="Move up">
          ↑
        </button>
        <div>
          <button onClick={() => move(-1, 0)} aria-label="Move left">
            ←
          </button>
          <button onClick={() => move(0, 1)} aria-label="Move down">
            ↓
          </button>
          <button onClick={() => move(1, 0)} aria-label="Move right">
            →
          </button>
        </div>
      </div>
      <p className="game-message" role="status">
        {message}
      </p>
    </div>
  );
}

type Gem = "power" | "water" | "air" | "plant";
const gemTypes: Gem[] = ["power", "water", "air", "plant"];
function makeBoard(seed: number): Gem[] {
  const board = Array.from(
    { length: 25 },
    (_, i) => gemTypes[(Math.floor(i / 5) + (i % 5) + seed) % 4],
  );
  board[0] = gemTypes[seed % 4];
  board[1] = gemTypes[(seed + 1) % 4];
  board[2] = gemTypes[seed % 4];
  board[6] = gemTypes[seed % 4];
  return board;
}
function matches(board: Gem[]) {
  const out = new Set<number>();
  for (let i = 0; i < 25; i++) {
    if (i % 5 < 3 && board[i] === board[i + 1] && board[i] === board[i + 2]) {
      out.add(i);
      out.add(i + 1);
      out.add(i + 2);
    }
    if (i < 15 && board[i] === board[i + 5] && board[i] === board[i + 10]) {
      out.add(i);
      out.add(i + 5);
      out.add(i + 10);
    }
  }
  return out;
}
function MatchGame({
  sound,
  onWin,
  onStep,
  onFeedback,
}: { sound: boolean; onWin: () => void } & Effects) {
  const [board, setBoard] = useState<Gem[]>(() => makeBoard(0)),
    [selected, setSelected] = useState<number | null>(null),
    [score, setScore] = useState(0),
    [message, setMessage] = useState(
      "Swap two neighbors. Match 3 gems to charge the rescue beacon.",
    );
  const [bursting, setBursting] = useState<number[]>([]);
  const [clearing, setClearing] = useState(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    },
    [],
  );
  const swap = (from: number, i: number) => {
    if (clearing) return;
    if (from === i) {
      setSelected(null);
      return;
    }
    if (
      Math.abs(Math.floor(from / 5) - Math.floor(i / 5)) +
        Math.abs((from % 5) - (i % 5)) !==
      1
    ) {
      setSelected(i);
      setMessage("Pick a neighboring gem to swap.");
      onFeedback("bad", "Swap neighbors");
      return;
    }
    const next = [...board];
    [next[from], next[i]] = [next[i], next[from]];
    const found = matches(next);
    setSelected(null);
    if (!found.size) {
      setMessage("No match there. Try another swap.");
      playCue("retry", sound);
      onFeedback("bad", "No match yet");
      return;
    }
    const gained = Math.floor(found.size / 3);
    const nextScore = score + gained;
    setScore(nextScore);
    playCue("match", sound);
    setBoard(next);
    setBursting([...found]);
    setClearing(true);
    onStep(`match-${nextScore}`, 10);
    setMessage(
      `${gained} match${gained > 1 ? "es" : ""}! Beacon charge ${Math.min(nextScore, 3)} / 3. Real station power also supports life support, so crews plan its use.`,
    );
    clearTimer.current = setTimeout(() => {
      setBoard(makeBoard(nextScore));
      setBursting([]);
      setClearing(false);
      onFeedback("good", "+10 · Match cleared!");
      if (nextScore >= 3) onWin();
    }, 650);
  };
  const choose = (i: number) => {
    if (selected === null) {
      setSelected(i);
      playCue("pick", sound);
    } else swap(selected, i);
  };
  return (
    <div className="match-game">
      <div className="beacon">
        <span>Rescue beacon</span>
        <strong>{Math.min(score, 3)} / 3 matches</strong>
        <div className="beacon-track">
          <i style={{ width: `${(Math.min(score, 3) / 3) * 100}%` }} />
        </div>
      </div>
      <div className={`match-board ${clearing ? "matching" : ""}`}>
        {board.map((gem, i) => (
          <button
            key={i}
            className={`gem ${selected === i ? "selected" : ""} ${bursting.includes(i) ? "bursting" : ""}`}
            onClick={() => choose(i)}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData("text/plain"));
              swap(from, i);
            }}
            aria-label={`${gem} gem row ${Math.floor(i / 5) + 1} column ${(i % 5) + 1}`}
          >
            <GameIcon name={gem} />
            {bursting.includes(i) && (
              <span className="gem-particles" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="game-message" role="status">
        {message}
      </p>
    </div>
  );
}

function Quiz({
  levelId,
  sound,
  onCorrect,
  onStep,
  onFeedback,
}: { levelId: number; sound: boolean; onCorrect: () => void } & Effects) {
  const item = arcadeQuestions[levelId - 1];
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const answer = (index: number) => {
    if (solved) return;
    setPicked(index);
    if (index === item.correct) {
      setSolved(true);
      playCue("reveal", sound);
      onFeedback("good", "Science idea discovered!");
    } else {
      onFeedback("bad", "Try another answer");
      playCue("retry", sound);
    }
  };
  return (
    <div className="arcade-quiz">
      <span className="eyebrow turquoise">ASTRO'S SCIENCE QUESTION</span>
      <div className="quiz-scene">
        <GameIcon
          name={
            levelId === 4
              ? "plant"
              : levelId === 2
                ? "water"
                : levelId === 3 || levelId === 5
                  ? "shelter"
                  : "air"
          }
        />
        <strong>{item.scene}</strong>
      </div>
      <div className="quiz-briefing"><strong>Remember the mission fact</strong><p>{item.briefing}</p></div>
      <h2>{item.question}</h2>
      <div className="quiz-answers">
        {item.answers.map((option, index) => (
          <button
            key={option}
            className={`quiz-answer ${picked === index ? (index === item.correct ? "right" : "wrong") : ""}`}
            onClick={() => answer(index)}
            disabled={solved}
          >
            {option}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div
          className={`quiz-explanation ${solved ? "right" : "wrong"}`}
          role="status"
        >
          <strong>
            {solved
              ? "You used the science!"
              : "Good try. Use this clue and try again."}
          </strong>
          <p>{solved ? item.explanation : item.wrongFeedback[picked]}</p>
        </div>
      )}
      {solved && <div className="quiz-takeaway">
        <GameIcon name="spark" />
        <div><strong>What you learned</strong><p>{item.takeaway}</p></div>
      </div>}
      {solved && !finished && <button className="primary quiz-finish" onClick={() => {
        setFinished(true);
        onStep("question", 10);
        onFeedback("good", "+10 · Knowledge earned!");
        onCorrect();
      }}>Collect my stars and finish</button>}
      <div className="quiz-source">
        <strong>Real science source</strong>
        <a href={item.source.url} target="_blank" rel="noreferrer">
          {item.source.label} ↗
        </a>
        <span>{item.source.date}</span>
        <small>
          Arcade points and this Moon outpost are fictional learning tools.
        </small>
      </div>
    </div>
  );
}

export default function Arcade({
  levelId,
  sound,
  done,
  onWin,
  onNext,
  onMap,
  onProgress,
}: Props) {
  const [won, setWon] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [flash, setFlash] = useState<{
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
  const level = arcadeLevels[levelId - 1];
  const learning = arcadeQuestions[levelId - 1];
  const feedback: Effects["onFeedback"] = (kind, message) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ kind, message, id: Date.now() });
    flashTimer.current = setTimeout(
      () => setFlash(null),
      kind === "bad" ? 950 : 800,
    );
  };
  const step: Effects["onStep"] = (key, points) => onProgress(key, points);
  const challengeWin = () => {
    if (challengeDone) return;
    setChallengeDone(true);
    step("challenge", 5);
    feedback("good", "Rescue challenge complete!");
  };
  const win = () => {
    if (won) return;
    setWon(true);
    playCue("level", sound);
    onWin();
    feedback("good", done ? "Level complete!" : "+40 · Level complete!");
  };
  const tip = [
    "Drag the three supplies into the picture. You can also tap a supply, then tap its place.",
    "Choose a symbol and fill the empty cells. No supply repeats in a row, column, or small box.",
    "Use the arrows. Pick up oxygen before you drive to the astronaut.",
    "Tap two neighbors to swap them. Make three matching gems in a row or column.",
    "The storm is coming. Drag the shield, radio, and charge pack to the correct places.",
  ][levelId - 1];
  return (
    <div className="arcade-page">
      <div className="arcade-heading">
        <button className="text-button" onClick={onMap}>
          ← Mission map
        </button>
        <span className="arcade-level-pill">
          LEVEL {levelId} OF 5 · {level.kind}
        </span>
      </div>
      <div className="arcade-title">
        <div>
          <span className="eyebrow turquoise">RESCUE ARCADE</span>
          <h1>{level.title}</h1>
          <p>{level.summary}</p>
        </div>
        <span className="arcade-title-icon">
          <GameIcon name={level.icon} />
        </span>
      </div>
      <div className="arcade-layout">
        <section className="arcade-main">
          {challengeDone ? (
            <Quiz
              levelId={levelId}
              sound={sound}
              onCorrect={win}
              onStep={step}
              onFeedback={feedback}
            />
          ) : (
            <>
              {levelId === 1 && (
                <Rescue
                  storm={false}
                  sound={sound}
                  onWin={challengeWin}
                  onStep={step}
                  onFeedback={feedback}
                />
              )}
              {levelId === 2 && (
                <LogicGrid
                  sound={sound}
                  onWin={challengeWin}
                  onStep={step}
                  onFeedback={feedback}
                />
              )}
              {levelId === 3 && (
                <Rover
                  sound={sound}
                  onWin={challengeWin}
                  onStep={step}
                  onFeedback={feedback}
                />
              )}
              {levelId === 4 && (
                <MatchGame
                  sound={sound}
                  onWin={challengeWin}
                  onStep={step}
                  onFeedback={feedback}
                />
              )}
              {levelId === 5 && (
                <Rescue
                  storm
                  sound={sound}
                  onWin={challengeWin}
                  onStep={step}
                  onFeedback={feedback}
                />
              )}
            </>
          )}
        </section>
        <aside className="arcade-guide">
          <Astro mood={won ? "celebrate" : "point"} />
          <span className="eyebrow">ASTRO'S TIP</span>
          <h2>
            {won
              ? "You saved the crew!"
              : challengeDone
                ? "One science question"
                : "Here's your mission"}
          </h2>
          <p>
            {won
              ? learning.takeaway
              : challengeDone
                ? "Use the mission fact to answer. A wrong answer gives you a clue."
                : tip}
          </p>
          {!challengeDone && <div className="arcade-learn-card">
            <span>{won ? "YOUR NEW KNOWLEDGE" : "MISSION FACT"}</span>
            <p>{won ? learning.takeaway : learning.briefing}</p>
            <a href={learning.source.url} target="_blank" rel="noreferrer">{learning.source.label} ↗</a>
          </div>}
          <div className="arcade-stars">{won || done ? "★ ★ ★" : "☆ ☆ ☆"}</div>
          {won && (
            <button className="primary" onClick={onNext}>
              {levelId === 5 ? "Back to map" : "Play next level →"}
            </button>
          )}
        </aside>
      </div>
      {flash && (
        <div
          key={flash.id}
          className={`feedback-screen ${flash.kind}`}
          aria-hidden="true"
        >
          <div className="feedback-burst">
            <GameIcon name={flash.kind === "good" ? "spark" : "shield"} />
            <strong>{flash.message}</strong>
            {flash.kind === "good" && (
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
    </div>
  );
}
