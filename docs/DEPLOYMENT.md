# Deployment notes

## Build and verify

From the project root, install dependencies and run:

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
npm.cmd run preview
```

On macOS or Linux, use `npm` instead of `npm.cmd`. The client build is written to `dist/`. The end-to-end scripts currently expect Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe` and write screenshots to `tests/`.

## Host requirements

Serve `dist/` over HTTPS. The game is a client-rendered single-page app, so configure the host to return `index.html` for app routes if deep links are added. No database or user account is required for the current MVP. Progress and settings are stored in each browser's local storage; clearing site data removes them.

Ask Astro's optional recent-flare action requests `GET /api/space-weather`. The route is implemented as Vite development and preview middleware in `vite.config.ts`; **the built `dist/` directory does not include a production server**. For a static deployment, implement the same route in the host's server or serverless environment, or expect the live report to show its unavailable message. Keep the response shape `{ events, checkedAt, source, note }`, where each event has `id`, `beganAt`, `classType`, and a NASA `url`.

The route first requests NASA CCMC's public DONKI API. `NASA_API_KEY` is optional and used only for the older `api.nasa.gov` fallback. Configure it as a server-side secret, if needed. Never place it in `dist/`, a client environment variable, or source control. `.env.local` is ignored by Git; `.env.example` contains only the variable name.

## Before a public release

1. Run the commands above and check desktop and mobile layout, keyboard use, sound-off mode, and reduced motion.
2. Have an educator review science wording and age suitability. Check that source links still resolve.
3. Confirm the live-report route works in the chosen hosting environment or document its unavailable state.
4. Review the browser storage behavior and reset action against the release's privacy expectations.
5. Confirm no credentials or local `.env` files are included in the commit or deployment artifact.
