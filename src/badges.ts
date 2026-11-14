import type { Amounts } from "./engine";

export type BadgeProgress = {
  stars: Record<number, number>;
  insights?: Record<number, boolean>;
  history: { level: number; choice: string; turn: number }[];
  best?: Record<number, Partial<Amounts>>;
};

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  criterion: string;
  image: string;
  earned: (progress: BadgeProgress) => boolean;
};

export const badges: BadgeDefinition[] = [
  {
    id: "first-launch",
    title: "First Launch",
    description: "You made a safe start on the Moon.",
    criterion: "Complete Mission 1.",
    image: "/badges/first-launch.svg",
    earned: (p) => !!p.stars[1],
  },
  {
    id: "air-guardian",
    title: "Air Guardian",
    description: "You left the crew a strong air reserve.",
    criterion: "Finish Mission 1 with at least 70 air points.",
    image: "/badges/air-guardian.svg",
    earned: (p) => (p.best?.[1]?.air ?? 0) >= 70,
  },
  {
    id: "power-planner",
    title: "Power Planner",
    description: "You saved battery power for the next step.",
    criterion: "Finish Mission 1 with at least 40 power points.",
    image: "/badges/power-planner.svg",
    earned: (p) => (p.best?.[1]?.power ?? 0) >= 40,
  },
  {
    id: "crater-cartographer",
    title: "Crater Cartographer",
    description: "You found time for science and life support.",
    criterion: "Complete Mission 1 after choosing a scan.",
    image: "/badges/crater-cartographer.svg",
    earned: (p) =>
      !!p.stars[1] &&
      p.history.some(
        (h) => h.level === 1 && h.choice.toLowerCase().includes("scan"),
      ),
  },
  {
    id: "storm-scout",
    title: "Storm Scout",
    description: "You adjusted your mission during a warning.",
    criterion: "Complete Mission 2.",
    image: "/badges/storm-scout.svg",
    earned: (p) => !!p.stars[2],
  },
  {
    id: "shelter-hero",
    title: "Shelter Hero",
    description: "You put crew protection into the plan.",
    criterion: "Complete Mission 2 after moving the crew to shelter.",
    image: "/badges/shelter-hero.svg",
    earned: (p) =>
      !!p.stars[2] &&
      p.history.some((h) => h.level === 2 && h.choice === "Move into shelter"),
  },
  {
    id: "sun-sleuth",
    title: "Sun Sleuth",
    description: "You spotted the key safety trade-off.",
    criterion: "Earn the Mission 2 Insight and finish the mission.",
    image: "/badges/sun-sleuth.svg",
    earned: (p) => !!p.stars[2] && !!p.insights?.[2],
  },
  {
    id: "garden-pilot",
    title: "Garden Pilot",
    description: "You guided a crop from plan to harvest.",
    criterion: "Complete Mission 3.",
    image: "/badges/garden-pilot.svg",
    earned: (p) => !!p.stars[3],
  },
  {
    id: "water-wizard",
    title: "Water Wizard",
    description: "You protected the habitat's water reserve.",
    criterion: "Finish Mission 3 with at least 30 water points.",
    image: "/badges/water-wizard.svg",
    earned: (p) => (p.best?.[3]?.water ?? 0) >= 30,
  },
  {
    id: "tradeoff-thinker",
    title: "Trade-off Thinker",
    description: "You finished every Moon mission.",
    criterion: "Complete all three missions.",
    image: "/badges/tradeoff-thinker.svg",
    earned: (p) => [1, 2, 3].every((id) => !!p.stars[id]),
  },
];

export const earnedBadges = (progress: BadgeProgress) =>
  badges.filter((badge) => badge.earned(progress));
