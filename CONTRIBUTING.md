# Contributing

ASTRO is an educational MVP. Changes to a mission should preserve a clear child-facing decision, immediate causal feedback, and an accurate takeaway. Keep the source link near the claim it supports, and mark invented resource values as game values.

## Local workflow

1. Install Node.js 20 or newer and run `npm.cmd install` (`npm install` on macOS or Linux).
2. Run `npm.cmd run dev` to inspect the affected screen.
3. Run `npm.cmd test`, `npm.cmd run test:e2e`, and `npm.cmd run build` before proposing a release. The browser tests currently require Chrome at the Windows path shown in the README.
4. Review screenshot changes under `tests/` before committing them; the test scripts regenerate those files.

Keep controls usable by keyboard and touch. Provide visible focus, text feedback alongside color or sound, and a reduced-motion state for any new animation. Avoid adding a second confirmation for an MCQ answer. If gameplay or persistence changes, update the README and the relevant design notes.

For science content, prefer a primary agency source, record its URL and limitation, and explain what a wrong answer teaches. Do not treat fictional Moon-base gauges or points as real measurements. Do not commit API keys; use `.env.local` for the optional server-side `NASA_API_KEY` fallback.
