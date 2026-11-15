import { createServer } from "vite";
import { chromium } from "playwright-core";

const server = await createServer({
  server: { host: "127.0.0.1", port: 5178, strictPort: true },
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
await page.route("https://**/*", (route) => route.abort());
try {
  await page.goto("http://127.0.0.1:5178/", { waitUntil: "networkidle" });
  await page.screenshot({ path: "tests/welcome-1280.png", fullPage: true });
  await page.getByRole("button", { name: "Mute sound effects" }).click();
  await page.getByRole("button", { name: "Turn on sound effects" }).click();
  if (
    (await page
      .getByRole("button", { name: "Mute sound effects" })
      .getAttribute("aria-pressed")) !== "true"
  )
    throw new Error("Sound toggle did not turn on");
  if ((await page.evaluate(() => window.__astroOscillators)) < 1)
    throw new Error("Sound cue did not play");
  await page.getByRole("button", { name: /start mission/i }).click();
  for (const [index, route] of [
    ["Scan the crater", "Run air recycler", "Run air recycler"],
    ["Move into shelter", "Run an indoor experiment", "Finish indoor science"],
    [
      "Grow leafy greens",
      "Ask Earth for advice",
      "Repair water recycler",
      "Recycle more water",
    ],
  ].entries()) {
    if (index === 0) await page.locator(".mission-node").first().click();
    await page
      .getByRole("button", { name: /start mission/i })
      .first()
      .click();
    await page.locator(".predict button").first().click();
    await page.locator(".prediction-note").getByText("Insight earned!").waitFor();
    if (index === 0) {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.screenshot({ path: "tests/mission-1280.png" });
    }
    if (index === 1)
      await page.screenshot({ path: "tests/storm-drag-1280.png" });
    if (index === 2)
      await page.screenshot({ path: "tests/garden-answers-1280.png" });
    for (const [shift, label] of route.entries()) {
      if (index === 1 && shift === 0) {
        await page
          .locator(".choice")
          .filter({ hasText: label })
          .dragTo(page.locator(".drop-zone"));
        await page
          .getByText("Drop your plan here")
          .waitFor({ state: "hidden" });
        await page.getByRole("button", { name: /confirm choice/i }).click();
      } else if (index === 0 && shift === 0) {
        await page.locator(".choice").filter({ hasText: label }).focus();
        await page.keyboard.press("Enter");
        await page.getByRole("button", { name: /confirm choice/i }).focus();
        await page.keyboard.press("Enter");
      } else {
        await page.locator(".choice").filter({ hasText: label }).click();
        await page.getByRole("button", { name: /confirm choice/i }).click();
      }
      const next =
        shift === route.length - 1 ? "See mission replay" : "Continue";
      await page.getByRole("button", { name: new RegExp(next, "i") }).click();
    }
    await page
      .getByRole("heading", { name: "What happened, shift by shift" })
      .waitFor();
    await page.locator(".answer").first().click();
    if (!(await page.locator(".badge-awards img").count()))
      throw new Error(`Mission ${index + 1} did not award badges`);
    if (index < 2)
      await page.getByRole("button", { name: /next mission/i }).click();
  }
  await page
    .getByRole("button", { name: /mission map/i })
    .first()
    .click();
  await page.reload();
  await page.locator(".arcade-map-grid").waitFor();
  if ((await page.locator(".xp-hud-total").innerText()) === "0 XP")
    throw new Error("Mission XP was lost on reload");
  if (await page.evaluate(() => localStorage.getItem("astro-save-v2") === null))
    throw new Error("Mission progress was not saved locally");
  await page.getByRole("button", { name: "Badges", exact: true }).click();
  if ((await page.locator(".badge-card").count()) !== 10)
    throw new Error("Badge gallery does not contain 10 badges");
  if ((await page.locator(".badge-card.earned").count()) < 8)
    throw new Error("Badges were lost on reload");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "tests/badges-1280.png",
    fullPage: true,
    style:
      "*, *::before, *::after { animation: none !important; transition: none !important; }",
  });
  await page.locator(".badge-card").first().click();
  await page.getByRole("dialog", { name: "First Launch" }).waitFor();
  await page.getByRole("button", { name: "Back to badges" }).click();
  await page
    .getByRole("button", { name: /Astro's notebook/i })
    .first()
    .click();
  await page.getByRole("heading", { name: "Astro has many moods" }).waitFor();
  if ((await page.locator(".astro-gallery-grid .astro").count()) !== 8)
    throw new Error("Astro variants missing");
  await page
    .getByRole("button", { name: /Settings/i })
    .first()
    .click();
  await page.getByLabel("Gentle motion").uncheck();
  if (
    !(await page
      .locator(".app")
      .evaluate((node) => node.classList.contains("reduce-motion")))
  )
    throw new Error("Reduced motion setting failed");
  if (
    (await page
      .locator(".astro")
      .first()
      .evaluate((node) => getComputedStyle(node).animationName)) !== "none"
  )
    throw new Error("Astro animation ignored reduced motion");
  await page
    .getByRole("button", { name: /Data & credits/i })
    .first()
    .click();
  await page.getByText("2024-05-10T06:27:00-FLR-001, version 2").waitFor();
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Browser path passed: 3 missions, reflection, fresh restart, credits; no page errors.",
  );
} finally {
  await browser.close();
  await server.close();
}
