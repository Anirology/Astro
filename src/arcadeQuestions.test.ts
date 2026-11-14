import { describe, expect, it } from "vitest";
import { arcadeQuestions } from "./arcadeQuestions";

describe("rescue arcade learning", () => {
  it("teaches, checks, and explains a distinct idea in every level", () => {
    expect(arcadeQuestions).toHaveLength(5);
    for (const [index, level] of arcadeQuestions.entries()) {
      expect(level.briefing.length).toBeGreaterThan(70);
      expect(level.takeaway.length).toBeGreaterThan(40);
      expect(level.wrongFeedback.filter(Boolean)).toHaveLength(2);
      expect(level.source.url).toMatch(/^https:\/\/(www\.|science\.)?nasa\.gov\//);
      expect(level.answers[level.correct].length).toBeGreaterThan(25);
      expect(level.scene.length, `level ${index + 1} needs a scenario`).toBeGreaterThan(35);
    }
    expect(new Set(arcadeQuestions.map((level) => level.takeaway)).size).toBe(5);
  });
});
