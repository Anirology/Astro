import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

type Flare = {
  flrID?: string;
  beginTime?: string;
  classType?: string;
  link?: string;
};

function nasaSpaceWeather(apiKey: string): Plugin {
  let cache: { expires: number; payload: unknown } | null = null;
  const handler = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Use GET for this request." }));
      return;
    }
    if (cache && Date.now() < cache.expires) {
      res.end(JSON.stringify(cache.payload));
      return;
    }
    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 7);
    const urls = [new URL("https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR")];
    if (apiKey) {
      const legacy = new URL("https://api.nasa.gov/DONKI/FLR");
      legacy.searchParams.set("api_key", apiKey);
      urls.push(legacy);
    }
    for (const url of urls) {
      url.searchParams.set("startDate", start.toISOString().slice(0, 10));
      url.searchParams.set("endDate", end.toISOString().slice(0, 10));
    }
    try {
      let raw: unknown;
      for (const url of urls) {
        try {
          const upstream = await fetch(url, {
            signal: AbortSignal.timeout(8000),
          });
          if (upstream.ok) {
            raw = await upstream.json();
            break;
          }
        } catch {
          /* Try the next official NASA route. */
        }
      }
      if (!Array.isArray(raw)) throw new Error("Unexpected NASA response");
      const events = (raw as Flare[])
        .slice(-5)
        .reverse()
        .map((item) => ({
          id: String(item.flrID || "Solar flare"),
          beganAt: String(item.beginTime || ""),
          classType: String(item.classType || "Unclassified"),
          url: (() => {
            try {
              const link = new URL(String(item.link || ""));
              return link.protocol === "https:" &&
                (link.hostname === "nasa.gov" ||
                  link.hostname.endsWith(".nasa.gov"))
                ? link.href
                : "https://ccmc.gsfc.nasa.gov/tools/DONKI/";
            } catch {
              return "https://ccmc.gsfc.nasa.gov/tools/DONKI/";
            }
          })(),
        }));
      const payload = {
        events,
        checkedAt: end.toISOString(),
        source: "NASA DONKI solar flare reports",
        note: "Past reports are not a Moon-base radiation measurement or safety forecast.",
      };
      cache = { expires: Date.now() + 10 * 60 * 1000, payload };
      res.end(JSON.stringify(payload));
    } catch {
      res.statusCode = 503;
      res.end(
        JSON.stringify({
          error:
            "NASA's live report is unavailable right now. Astro's learning answers still work.",
        }),
      );
    }
  };
  return {
    name: "astro-nasa-space-weather",
    configureServer(server) {
      server.middlewares.use("/api/space-weather", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/space-weather", handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = process.env.NASA_API_KEY || env.NASA_API_KEY || "";
  return { plugins: [react(), nasaSpaceWeather(apiKey)] };
});
