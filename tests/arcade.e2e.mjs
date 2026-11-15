import { createServer } from "vite";
import { chromium } from "playwright-core";

const server = await createServer({
  server: { host: "127.0.0.1", port: 5179, strictPort: true },
});
await server.listen();
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__astroOscillators = 0;
  const original = AudioContext.prototype.createOscillator;
  AudioContext.prototype.createOscillator = function (...args) {
    window.__astroOscillators++;
    return original.apply(this, args);
  };
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
async function finishQuiz(level) {
  await page.locator(".arcade-quiz").waitFor();
  if (!(await page.locator(".quiz-briefing").isVisible()))
    throw new Error(`Level ${level} did not teach a mission fact before the question`);
  await page.locator(".feedback-screen").waitFor({ state: "hidden" });
  if (level === 1)
    await page.screenshot({
      path: "tests/arcade-question.png",
      fullPage: true,
      style:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    });
  if (
    !(await page.locator(".quiz-source a").getAttribute("href"))?.startsWith(
      "https://",
    )
  )
    throw new Error(`Level ${level} has no science citation`);
  if (level === 1) {
    await page.locator(".quiz-answer").nth(1).click();
    if (!(await page.locator(".feedback-screen.bad").isVisible()))
      throw new Error("Wrong answer did not flash red");
    await page.screenshot({
      path: "tests/wrong-answer-flash.png",
      animations: "allow",
    });
  }
  await page.locator(".quiz-answer").first().click();
  await page.locator(".quiz-takeaway").waitFor();
  await page.getByRole("button", { name: "Collect my stars and finish" }).click();
  await page.getByText("You saved the crew!").waitFor();
}
try {
  await page.goto("http://127.0.0.1:5179/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /start mission/i }).click();
  if ((await page.locator(".arcade-map-card:not(.campaign-map-card)").count()) !== 5)
    throw new Error("Five arcade levels were not unlocked");
  await page.screenshot({
    path: "tests/arcade-map.png",
    fullPage: true,
    style:
      "*, *::before, *::after { animation: none !important; transition: none !important; }",
  });
  for (const [level, targets] of [
    [1, ["Astronaut", "Rover", "Airlock"]],
    [5, ["Shelter", "Crew", "Habitat"]],
  ]) {
    await page
      .locator(".arcade-map-card:not(.campaign-map-card)")
      .nth(level - 1)
      .click();
    if (level === 1)
      await page.screenshot({
        path: "tests/arcade-rescue.png",
        fullPage: true,
        style:
          "*, *::before, *::after { animation: none !important; transition: none !important; }",
      });
    if (level === 1) {
      await page.locator(".gear").first().click();
      await page.getByRole("button", { name: "Rover drop zone" }).click();
      if (!(await page.locator(".feedback-screen.bad").isVisible()))
        throw new Error("Wrong gear did not flash red");
      if (!(await page.locator(".xp-hud-total").innerText()).includes("0 XP"))
        throw new Error("Wrong gear awarded points");
    }
    for (let i = 0; i < 3; i++) {
      const notesBefore = level === 1 && i === 0
        ? await page.evaluate(() => window.__astroOscillators)
        : 0;
      const flightSeen = level === 1 && i === 0
        ? page.locator(".xp-flight").waitFor({ state: "visible" })
        : null;
      await page
        .locator(".gear")
        .first()
        .dragTo(page.getByRole("button", { name: `${targets[i]} drop zone` }));
      if (level === 1 && i === 0) {
        await flightSeen;
        if (!(await page.locator(".game-message").innerText()).includes("oxygen"))
          throw new Error("Correct rescue move did not teach its science fact");
        await page.getByRole("progressbar", { name: "XP toward next level" }).waitFor();
        await page.waitForFunction(() => document.querySelector(".xp-hud-total")?.textContent !== "0 XP");
        if (await page.locator(".xp-flight").count())
          throw new Error("XP reward did not settle after reaching the meter");
        if ((await page.evaluate(() => window.__astroOscillators)) - notesBefore < 6)
          throw new Error("XP arrival did not play its three-note chime");
      }
    }
    await finishQuiz(level);
    await page
      .getByRole("button", { name: /mission map/i })
      .last()
      .click();
  }
  await page.locator(".arcade-map-card:not(.campaign-map-card)").nth(1).click();
  const solution = [
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
  for (let i = 0; i < 16; i++) {
    if (await page.locator(".arcade-quiz").count()) break;
    const cell = page.locator(".logic-cell").nth(i);
    if (await cell.isDisabled()) continue;
    await page
      .getByRole("button", { name: `Select ${solution[i]} supply` })
      .click();
    await cell.click();
  }
  await finishQuiz(2);
  await page
    .getByRole("button", { name: /mission map/i })
    .last()
    .click();
  await page.locator(".arcade-map-card:not(.campaign-map-card)").nth(2).click();
  await page.keyboard.press("ArrowDown");
  for (const key of [
    "down",
    "right",
    "right",
    "down",
    "down",
    "right",
    "right",
  ])
    await page.getByRole("button", { name: `Move ${key}` }).click();
  await finishQuiz(3);
  await page
    .getByRole("button", { name: /mission map/i })
    .last()
    .click();
  await page.locator(".arcade-map-card:not(.campaign-map-card)").nth(3).click();
  for (let turn = 0; turn < 25; turn++) {
    if (await page.locator(".arcade-quiz").count()) break;
    const board = await page
      .locator(".gem")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("aria-label").split(" ")[0]),
      );
    const matches = (a) => {
      for (let i = 0; i < 25; i++)
        if (
          (i % 5 < 3 && a[i] === a[i + 1] && a[i] === a[i + 2]) ||
          (i < 15 && a[i] === a[i + 5] && a[i] === a[i + 10])
        )
          return true;
      return false;
    };
    let move = null;
    for (let i = 0; i < 25 && !move; i++)
      for (const j of [i + 1, i + 5]) {
        if (j >= 25 || (j === i + 1 && i % 5 === 4)) continue;
        const next = [...board];
        [next[i], next[j]] = [next[j], next[i]];
        if (matches(next)) {
          move = [i, j];
          break;
        }
      }
    if (!move) throw new Error("Match board has no possible move");
    if (turn === 0)
      await page
        .locator(".gem")
        .nth(move[0])
        .dragTo(page.locator(".gem").nth(move[1]));
    else {
      await page.locator(".gem").nth(move[0]).click();
      await page.locator(".gem").nth(move[1]).click();
    }
    if ((await page.locator(".gem.bursting").count()) < 3)
      throw new Error("Matched gems did not enter elimination animation");
    if (turn === 0)
      await page.screenshot({
        path: "tests/match-burst.png",
        animations: "allow",
      });
    await page.waitForTimeout(700);
  }
  await finishQuiz(4);
  await page
    .getByRole("button", { name: /mission map/i })
    .last()
    .click();
  if (
    (await page
      .locator(".arcade-map-card:not(.campaign-map-card) .arcade-map-action")
      .filter({ hasText: "Replay" })
      .count()) !== 5
  )
    throw new Error("Five level completions not shown");
  if (Number((await page.locator(".xp-hud-total").innerText()).replace(/\D/g, "")) < 200)
    throw new Error("XP did not increase across the arcade");
  await page.reload();
  await page.locator(".arcade-map-grid").waitFor();
  if ((await page.locator(".xp-hud-total").innerText()) === "0 XP")
    throw new Error("XP was lost after refresh");
  if (await page.evaluate(() => localStorage.getItem("astro-save-v2") === null))
    throw new Error("Progress was not saved locally");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Arcade passed: five unlocked levels, all mechanics, rewards, and fresh restart.",
  );
} finally {
  await browser.close();
  await server.close();
}
