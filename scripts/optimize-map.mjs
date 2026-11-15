import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

const directory = join(process.cwd(), "src", "assets", "mission-map");
const files = ["astro-mascot", "mission-01-suit-check", "mission-02-water-rescue", "mission-03-supply-logic", "mission-04-rover-route", "mission-05-power-challenge", "mission-06-greenhouse", "mission-07-safe-moon-home", "final-rescue-moon-base"];
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  const page = await browser.newPage();
  for (const name of files) {
    const source = await readFile(join(directory, `${name}.png`));
    const data = await page.evaluate(async (encoded) => {
      const image = new Image();
      image.src = `data:image/png;base64,${encoded}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas.toDataURL("image/webp", .86).split(",")[1];
    }, source.toString("base64"));
    const output = Buffer.from(data, "base64");
    await writeFile(join(directory, `${name}.webp`), output);
    console.log(`${name}: ${Math.round(source.length / 1024)} KB → ${Math.round(output.length / 1024)} KB`);
  }
} finally { await browser.close(); }
