import { describe, expect, it } from "vitest";
import { badges, earnedBadges, type BadgeProgress } from "./badges";

const progress: BadgeProgress = {
  stars: { 1: 3, 2: 3, 3: 3 },
  insights: { 2: true },
  best: { 1: { air: 70, power: 20 }, 3: { water: 50 } },
  history: [
    { level: 1, turn: 1, choice: "Scan the crater" },
    { level: 2, turn: 1, choice: "Move into shelter" },
  ],
};

describe("mission badges", () => {
  it("provides ten unique illustrated rewards", () => {
    expect(badges).toHaveLength(10);
    expect(new Set(badges.map((badge) => badge.id)).size).toBe(10);
    expect(
      badges.every((badge) => badge.image.endsWith(`${badge.id}.svg`)),
    ).toBe(true);
  });

  it("awards route-specific badges and leaves other strategies to replay", () => {
    expect(earnedBadges(progress).map((badge) => badge.id)).toEqual([
      "first-launch",
      "air-guardian",
      "crater-cartographer",
      "storm-scout",
      "shelter-hero",
      "sun-sleuth",
      "garden-pilot",
      "water-wizard",
      "tradeoff-thinker",
    ]);
    expect(
      earnedBadges({
        ...progress,
        best: { ...progress.best, 1: { air: 70, power: 40 } },
      }),
    ).toHaveLength(10);
  });
});
