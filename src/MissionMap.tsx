import { useState, type CSSProperties } from "react";
import { campaign, finalChallenge } from "./Campaign";
import astro from "./assets/mission-map/astro-mascot.webp";
import suit from "./assets/mission-map/mission-01-suit-check.webp";
import water from "./assets/mission-map/mission-02-water-rescue.webp";
import supplies from "./assets/mission-map/mission-03-supply-logic.webp";
import rover from "./assets/mission-map/mission-04-rover-route.webp";
import power from "./assets/mission-map/mission-05-power-challenge.webp";
import greenhouse from "./assets/mission-map/mission-06-greenhouse.webp";
import home from "./assets/mission-map/mission-07-safe-moon-home.webp";
import finalBase from "./assets/mission-map/final-rescue-moon-base.webp";

const art = [suit, water, supplies, rover, power, greenhouse, home, finalBase];
const stops = [
  { x: 10, y: 66 }, { x: 22, y: 35 }, { x: 35, y: 64 }, { x: 48, y: 35 },
  { x: 61, y: 64 }, { x: 74, y: 35 }, { x: 85, y: 64 }, { x: 91, y: 22 },
];
const path = "M160 620 C110 510 155 425 285 405 C370 390 440 470 470 610 C510 520 560 412 690 400 C800 390 820 470 835 590 C875 470 910 410 1040 410 C1160 410 1220 475 1260 585 C1400 520 1475 420 1450 315";

export default function MissionMap({ done, onStart }: { done: Record<number, unknown>; onStart: (id: number) => void }) {
  const completed = Object.keys(done).length;
  const [selected, setSelected] = useState(Math.min(8, completed + 1));
  const [launching, setLaunching] = useState(false);
  const mission = selected === 8 ? finalChallenge : campaign[selected - 1];
  const unlocked = selected !== 8 || completed >= 7;
  const start = () => {
    if (!unlocked || launching) return;
    setLaunching(true);
    window.setTimeout(() => onStart(selected), 380);
  };
  return <section className={`mission-map-world ${launching ? "launching" : ""}`} aria-label="Moon mission route">
    <div className="map-sky" aria-hidden="true"><span className="map-earth" /><i /><i /><i /><i /><i /></div>
    <div className="map-horizon" aria-hidden="true" />
    <svg className="map-route" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke="#163653" strokeWidth="36" strokeLinecap="round" opacity=".7" />
      <path d={path} fill="none" stroke="#66e8ed" strokeWidth="16" strokeLinecap="round" opacity=".65" />
      <path d={path} fill="none" stroke="#fff4ad" strokeWidth="6" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 - Math.min(1000, completed * 130)} className="map-route-progress" />
      <path id="mission-route" d={path} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 25" opacity=".8" />
    </svg>
    <img className="map-astro" src={astro} alt="Astro points to the next Moon mission" style={{ "--astro-x": `${stops[Math.min(completed, 7)].x}%`, "--astro-y": `${stops[Math.min(completed, 7)].y}%` } as CSSProperties} />
    <div className="map-landmarks">
      {[...campaign, finalChallenge].map((item, index) => {
        const id = index + 1;
        const active = selected === id;
        const complete = !!done[id];
        const locked = id === 8 && completed < 7;
        return <button key={id} type="button" className={`campaign-map-card map-landmark ${index === 7 ? "final" : ""} ${active ? "selected" : ""} ${complete ? "complete" : ""} ${locked ? "locked" : ""}`} style={{ "--x": `${stops[index].x}%`, "--y": `${stops[index].y}%`, "--order": index } as CSSProperties} onClick={() => setSelected(id)} onFocus={() => setSelected(id)} aria-pressed={active} aria-label={`Mission ${id}: ${item.title}${complete ? ", learned" : locked ? ", locked until seven missions are learned" : ""}`}>
          <img src={art[index]} alt="" draggable={false} />
          <span className="map-landmark-label"><b className="map-landmark-number">{complete ? "★" : id}</b><strong>{item.title}</strong></span>
          <span className="arcade-map-action">{complete ? "★ Learned · Replay" : locked ? "Finish seven missions" : "Select mission"}</span>
        </button>;
      })}
    </div>
    <div className="map-dock" aria-live="polite"><div><span>MISSION {selected} OF 8 {done[selected] ? "· LEARNED" : ""}</span><strong>{mission.title}</strong><p>{mission.goal}</p></div><button className="map-start" disabled={!unlocked || launching} onClick={start}>{unlocked ? done[selected] ? "REPLAY MISSION" : "START MISSION" : "COMPLETE SEVEN MISSIONS"} <span aria-hidden="true">▶</span></button></div>
  </section>;
}
