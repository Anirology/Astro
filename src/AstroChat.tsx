import { useEffect, useRef, useState } from "react";
import Astro from "./Astro";
import GameIcon from "./GameIcon";
import { playCue } from "./audio";
import {
  answerAstro,
  chatSuggestions,
  type ChatContext,
  type ChatLink,
} from "./astroKnowledge";

type Message = {
  id: number;
  role: "astro" | "you";
  text: string;
  links?: ChatLink[];
};
type LiveEvent = {
  id: string;
  beganAt: string;
  classType: string;
  url: string;
};
type LiveReport = { events: LiveEvent[]; checkedAt: string; note: string };

export default function AstroChat({ context, sound }: { context: ChatContext; sound: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "astro",
      text: "Hi! I'm Astro. Ask me what to do next, why a choice matters, or where the science came from.",
    },
  ]);
  const input = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);
  const add = (role: Message["role"], text: string, links?: ChatLink[]) =>
    setMessages((current) =>
      [...current, { id: nextId.current++, role, text, links }].slice(-24),
    );
  const hasOpened = useRef(false);
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      input.current?.focus();
    } else if (hasOpened.current) launcher.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open)
      bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, open]);
  const ask = async (text: string) => {
    const question = text.trim().slice(0, 180);
    if (!question || busy) return;
    add("you", question);
    playCue("chat", sound);
    setDraft("");
    const answer = answerAstro(question, context);
    if (!answer.live) {
      add("astro", answer.text, answer.links);
      playCue("reveal", sound);
      return;
    }
    setBusy(true);
    add("astro", answer.text);
    try {
      const response = await fetch("/api/space-weather", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Live report unavailable");
      const report = (await response.json()) as LiveReport;
      const events = report.events.slice(0, 3);
      if (!events.length)
        add(
          "astro",
          "NASA DONKI returned no solar-flare reports for the past seven UTC days. That does not prove space weather is quiet. These are past reports, not a Moon-base safety forecast.",
          [
            {
              label: "NASA CCMC · DONKI",
              url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/",
            },
          ],
        );
      else
        add(
          "astro",
          `NASA DONKI's newest flare report from the past seven UTC days is ${events[0].classType}, dated ${events[0].beganAt.replace("T", " ").replace(/Z$/, "")} UTC. Past flare reports do not tell us the radiation dose at our fictional Moon base.`,
          [
            { label: "Open NASA's newest report", url: events[0].url },
            {
              label: "About NASA DONKI data",
              url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/",
            },
          ],
        );
    } catch {
      add(
        "astro",
        "I couldn't reach NASA's live report right now. I can still explain the storm mission using NASA's archived guidance.",
        [
          {
            label: "NASA · Space radiation and shelter",
            url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/",
          },
        ],
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={`astro-chat ${open ? "open" : ""}`}>
      {open && (
        <section
          className="chat-panel"
          role="dialog"
          aria-label="Ask Astro"
          aria-modal="false"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <header className="chat-header">
            <div className="chat-header-avatar">
              <Astro mood="wave" small />
            </div>
            <div>
              <strong>Ask Astro</strong>
              <span>Mission guide · science helper</span>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close Astro chat"
            >
              ×
            </button>
          </header>
          <div
            className="chat-transcript"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                <span className="chat-avatar">
                  {message.role === "astro" ? (
                    <Astro mood="explain" small />
                  ) : (
                    "You"
                  )}
                </span>
                <div className="chat-bubble">
                  <p>{message.text}</p>
                  {message.links?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {busy && (
              <div className="chat-thinking" role="status">
                Checking NASA's report…
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="chat-prompts" aria-label="Suggested questions">
            {chatSuggestions(context).map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => void ask(prompt)}
                disabled={busy}
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(draft);
            }}
          >
            <input
              ref={input}
              value={draft}
              maxLength={180}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Astro a question…"
              aria-label="Your question for Astro"
            />
            <button
              type="submit"
              disabled={!draft.trim() || busy}
              aria-label="Send question"
            >
              <GameIcon name="send" />
            </button>
          </form>
          <p className="chat-note">
            Questions stay in this browser. Only the live NASA button fetches
            reports.
          </p>
        </section>
      )}
      <button
        type="button"
        className="chat-launcher"
        ref={launcher}
        onClick={() => { setOpen((value) => !value); playCue("chat", sound); }}
        aria-label={open ? "Hide Astro chat" : "Ask Astro a question"}
        aria-expanded={open}
      >
        <Astro mood={open ? "point" : "wave"} small />
        <span>{open ? "Hide chat" : "Ask Astro"}</span>
        <GameIcon name="chat" />
      </button>
    </div>
  );
}
