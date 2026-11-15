import { createServer } from "vite";
import { chromium } from "playwright-core";

const server = await createServer({
  server: { host: "127.0.0.1", port: 5180, strictPort: true },
});
await server.listen();
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.route("https://**/*", (route) => route.abort());
await page.route("**/api/space-weather", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      events: [
        {
          id: "test-flare",
          beganAt: "2026-11-14T09:30Z",
          classType: "M2.1",
          url: "https://ccmc.gsfc.nasa.gov/DONKI/events/test",
        },
      ],
      checkedAt: "2026-11-14T10:00:00Z",
      note: "Past reports are not forecasts.",
    }),
  }),
);
try {
  await page.goto("http://127.0.0.1:5180/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /start mission/i }).click();
  if ((await page.locator(".header-nav .game-icon").count()) !== 5)
    throw new Error("Navigation icons missing");
  await page.getByRole("button", { name: "Ask Astro a question" }).click();
  await page.getByRole("dialog", { name: "Ask Astro" }).waitFor();
  await page.waitForTimeout(350);
  await page.screenshot({
    path: "tests/astro-chat-1280.png",
    style:
      "*, *::before, *::after { animation: none !important; transition: none !important; }",
  });
  const input = page.getByRole("textbox", { name: "Your question for Astro" });
  await input.fill("How do astronauts get air?");
  await input.press("Enter");
  await page
    .locator(".chat-message.astro")
    .last()
    .getByRole("link", { name: /NASA.*Life support systems/ })
    .waitFor();
  await input.fill("What should I play next?");
  await input.press("Enter");
  if (
    !(await page.locator(".chat-message.astro").last().innerText()).includes(
      "five rescue games",
    )
  )
    throw new Error("Map guidance did not use page context");
  await page.getByRole("button", { name: "Show recent NASA flares" }).click();
  await page.locator(".chat-message.astro").last().getByText(/M2\.1/).waitFor();
  if (
    !(
      await page
        .locator(".chat-message.astro")
        .last()
        .getByRole("link", { name: /newest report/ })
        .getAttribute("href")
    ).startsWith("https://ccmc.gsfc.nasa.gov/")
  )
    throw new Error("Live report citation missing");
  await page.getByRole("button", { name: "Close Astro chat" }).click();
  await page.locator(".arcade-map-card:not(.campaign-map-card)").first().click();
  await page.getByRole("button", { name: "Ask Astro a question" }).click();
  await page
    .getByRole("button", { name: "How do I rescue the astronaut?" })
    .click();
  if (
    !(await page.locator(".chat-message.astro").last().innerText()).includes(
      "oxygen pack",
    )
  )
    throw new Error("Level guidance did not use game context");
  await page.keyboard.press("Escape");
  if (await page.getByRole("dialog", { name: "Ask Astro" }).count())
    throw new Error("Escape did not close Astro chat");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Astro chat passed: contextual answers, source links, live report card, and navigation icons.",
  );
} finally {
  await browser.close();
  await server.close();
}
