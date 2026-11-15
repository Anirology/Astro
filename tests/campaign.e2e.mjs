import { createServer } from "vite";
import { chromium } from "playwright-core";
const server = await createServer({ server: { host: "127.0.0.1", port: 5188, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = []; page.on("pageerror", error => errors.push(error.message));
try {
  await page.goto("http://127.0.0.1:5188/");
  await page.getByRole("button", { name: /start mission/i }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "tests/campaign-map.png", fullPage: true });
  await page.locator(".campaign-map-card").nth(1).focus();
  if (!(await page.locator(".map-dock strong").innerText()).includes("Water Rescue")) throw new Error("Keyboard focus did not update the mission dock");
  await page.locator(".campaign-map-card").first().focus();
  await page.locator(".campaign-map-card").last().click();
  if (await page.locator(".map-start").isEnabled()) throw new Error("Final base unlocked too early");
  for (let id = 1; id <= 8; id++) {
    await page.locator(".campaign-map-card").nth(id - 1).click();
    await page.locator(".map-start").click();
    if (id === 1) { await page.getByRole("button", { name: "Pause mission" }).click(); await page.getByRole("dialog", { name: "Mission paused" }).waitFor(); await page.getByRole("button", { name: "Resume mission" }).last().click(); }
    if (id === 1) await page.screenshot({ path: "tests/campaign-briefing.png", fullPage: true });
    await page.locator(".campaign-dialog").getByRole("button", { name: /start mission/i }).click();
    let steps = id === 1 || id === 2 ? 3 : 2;
    for (let i = 0; i < steps; i++) {
      if (id === 1 && i === 0) { await page.locator(".campaign-options button").nth(1).click(); await page.getByText(/try another plan/i).waitFor(); await page.screenshot({ path: "tests/campaign-recovery.png", fullPage: true }); }
      await page.locator(".campaign-options button").first().click();
      if (await page.getByRole("button", { name: /try my plan/i }).count()) throw new Error("Duplicate MCQ confirmation appeared");
      await page.getByRole("button", { name: /continue mission/i }).click();
    }
    await page.locator(".campaign-options button").first().click();
    await page.getByRole("button", { name: /see what i learned/i }).click();
    await page.getByRole("heading", { name: "What you learned" }).waitFor();
    if (id === 8) await page.screenshot({ path: "tests/campaign-final.png", fullPage: true });
    await page.getByRole("button", { name: /back to mission map/i }).click();
  }
  await page.reload();
  if ((await page.locator(".campaign-map-card .arcade-map-action").filter({ hasText: "Learned" }).count()) !== 8) throw new Error("Learning progress was lost on refresh");
  if (!(await page.locator(".moonfire").getAttribute("aria-label"))?.includes("1 day")) throw new Error("Moonfire streak did not update");
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto("http://127.0.0.1:5188/");
  await mobile.getByRole("button", { name: /start mission/i }).click();
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: "tests/campaign-map-mobile.png", fullPage: true });
  await mobile.locator(".campaign-map-card").first().click();
  await mobile.locator(".map-start").click();
  await mobile.locator(".campaign-dialog").getByRole("button", { name: /start mission/i }).waitFor();
  await mobile.close();
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("Campaign passed: seven missions, final challenge, correction, and refresh persistence.");
} finally { await browser.close(); await server.close(); }
