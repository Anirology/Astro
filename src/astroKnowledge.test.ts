import { describe, expect, it } from "vitest";
import { answerAstro, type ChatContext } from "./astroKnowledge";

const context: ChatContext = {
  page: "arcade",
  arcadeId: 3,
  levelId: 1,
  turn: 1,
  xp: 42,
  streak: 2,
  arcadeDone: 1,
  scienceDone: 0,
  badges: 0,
};

describe("Astro chat guidance", () => {
  it("uses the current game for a next-step hint", () => {
    const reply = answerAstro("Help me drive the rover", context);
    expect(reply.text).toContain("oxygen pack");
    expect(reply.text).toContain("arrow");
  });
  it("attaches an agency source to science explanations", () => {
    const reply = answerAstro("Why do plants need light?", context);
    expect(reply.links?.[0].url).toContain("asc-csa.gc.ca");
    expect(reply.text).toContain("harvest");
  });
  it("uses the active scenario when explaining why it matters", () => {
    const reply = answerAstro("Why does this matter in space?", {
      ...context,
      arcadeId: 5,
    });
    expect(reply.links?.[0].url).toContain("science.nasa.gov");
  });
  it("connects the rover and power games to their actual science", () => {
    const rover = answerAstro("Why does this matter in space?", { ...context, arcadeId: 3 });
    expect(rover.links?.[0].url).toContain("extravehicular-mobility-unit");
    const match = answerAstro("Why does this matter in space?", { ...context, arcadeId: 4 });
    expect(match.links?.[0].url).toContain("solar-arrays");
  });
  it("explains a named badge's exact goal", () => {
    expect(answerAstro("How do I earn Power Planner?", context).text).toContain(
      "40 power points",
    );
  });
  it("keeps live data separate from safety forecasts", () => {
    const reply = answerAstro("Show recent NASA flares", context);
    expect(reply.live).toBe(true);
    expect(reply.text).toContain("not a safety forecast");
  });
  it("does not invent an answer to an unrelated question", () => {
    const reply = answerAstro("Tell me about ancient coins", context);
    expect(reply.text).toContain("I can help with");
    expect(reply.links).toBeUndefined();
  });
  it("explains session XP and the restart rule", () => {
    const reply = answerAstro("How does the XP bar work?", context);
    expect(reply.text).toContain("100 XP");
    expect(reply.text).toContain("Refresh");
  });
  it("explains a mistake without taking XP away", () => {
    const reply = answerAstro("What happens after a wrong move?", context);
    expect(reply.text).toContain("do not remove XP");
  });
  it("cites the next-shift resource explanation", () => {
    const reply = answerAstro("Why plan for the next shift?", context);
    expect(reply.links?.[0].url).toContain("nasa.gov");
    expect(reply.text).toContain("later effect");
  });
});
