import type { SVGProps } from "react";

export type IconName =
  | "map"
  | "book"
  | "badge"
  | "settings"
  | "source"
  | "chat"
  | "send"
  | "astronaut"
  | "rover"
  | "habitat"
  | "shelter"
  | "air"
  | "power"
  | "water"
  | "shield"
  | "radio"
  | "grid"
  | "crystal"
  | "storm"
  | "rock"
  | "plant"
  | "spark";

export default function GameIcon({
  name,
  className = "",
  ...props
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const art = {
    map: (
      <>
        <path
          d="M8 15 23 10l18 5 15-5v39l-15 5-18-5-15 5Z"
          fill="#e3f8f7"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M23 10v39m18-34v39" {...common} stroke="#6abfca" />
        <path
          d="M14 39c6-10 13-12 22-9s13 0 16-10"
          {...common}
          stroke="#234c72"
          strokeWidth="3"
        />
        <circle
          cx="15"
          cy="40"
          r="4"
          fill="#ffcb60"
          stroke="#234c72"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="20"
          r="4"
          fill="#ff765f"
          stroke="#234c72"
          strokeWidth="2"
        />
      </>
    ),
    book: (
      <>
        <path
          d="M6 13c11-5 19-4 26 2 7-6 15-7 26-2v39c-11-5-19-4-26 2-7-6-15-7-26-2Z"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M32 15v39M12 23c5-2 9-2 14 0m-14 8c5-2 9-2 14 0m12-8c5-2 9-2 14 0m-14 8c5-2 9-2 14 0"
          {...common}
          stroke="#73bacb"
          strokeWidth="2"
        />
      </>
    ),
    badge: (
      <>
        <circle
          cx="32"
          cy="26"
          r="20"
          fill="#ffebac"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="m21 42-4 18 15-7 15 7-4-18"
          fill="#77d5c8"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="m32 12 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z"
          fill="#ffca57"
          stroke="#234c72"
          strokeWidth="2"
        />
      </>
    ),
    settings: (
      <>
        <path
          d="M28 7h8l2 7 6 3 7-3 5 7-5 6v8l5 6-5 7-7-3-6 3-2 7h-8l-2-7-6-3-7 3-5-7 5-6v-8l-5-6 5-7 7 3 6-3Z"
          fill="#e4f8f4"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle
          cx="32"
          cy="32"
          r="10"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
        />
      </>
    ),
    source: (
      <>
        <rect
          x="13"
          y="7"
          width="38"
          height="50"
          rx="5"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M21 18h22M21 25h16M21 43h22"
          {...common}
          stroke="#73bacb"
          strokeWidth="3"
        />
        <circle
          cx="31"
          cy="35"
          r="5"
          fill="#ffda77"
          stroke="#234c72"
          strokeWidth="2"
        />
        <path d="m35 39 7 6" {...common} stroke="#234c72" />
      </>
    ),
    chat: (
      <>
        <path
          d="M8 13h48v33H28L15 56V46H8Z"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="30" r="3" fill="#25c5b7" />
        <circle cx="32" cy="30" r="3" fill="#ffcb60" />
        <circle cx="43" cy="30" r="3" fill="#ff765f" />
      </>
    ),
    send: (
      <>
        <path
          d="m6 29 52-22-15 50-11-19-26-9Z"
          fill="#e2f9f5"
          stroke="#234c72"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M32 38 58 7M32 38l-3 16" {...common} stroke="#278eaa" />
      </>
    ),
    astronaut: (
      <>
        <circle
          cx="32"
          cy="25"
          r="17"
          fill="#d7f6ff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M18 26c1-10 7-16 14-16s13 6 14 16" {...common} />
        <rect x="21" y="20" width="22" height="13" rx="6" fill="#234c72" />
        <circle cx="27" cy="25" r="1.5" fill="white" />
        <circle cx="37" cy="25" r="1.5" fill="white" />
        <path
          d="M25 40l-6 7 4 9h18l4-9-6-7"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M23 55l-3 5m21-5 3 5M18 43l-7 8m35-8 7 8"
          {...common}
          stroke="#234c72"
        />
        <circle cx="32" cy="49" r="3" fill="#ffcb60" />
      </>
    ),
    rover: (
      <>
        <path
          d="M10 39h44l-5-19H22L10 39Z"
          fill="#75cbec"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M24 21v17m12-17 4 17" {...common} stroke="#234c72" />
        <path d="M9 39h47v9H9z" fill="#fff" stroke="#234c72" strokeWidth="3" />
        <circle cx="20" cy="50" r="6" fill="#234c72" />
        <circle cx="45" cy="50" r="6" fill="#234c72" />
        <path d="M30 16V8h14" {...common} stroke="#234c72" />
        <circle cx="46" cy="8" r="3" fill="#ffcb60" />
      </>
    ),
    habitat: (
      <>
        <path
          d="M8 53V34c0-14 10-24 24-24s24 10 24 24v19Z"
          fill="#e7f8f8"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M15 35h34" {...common} stroke="#59b5d5" />
        <rect x="25" y="37" width="14" height="16" rx="4" fill="#234c72" />
        <circle cx="32" cy="45" r="2" fill="#ffcb60" />
        <path d="M5 54h54" {...common} stroke="#234c72" />
      </>
    ),
    shelter: (
      <>
        <path
          d="M7 55 14 25 32 9l18 16 7 30Z"
          fill="#d9f8eb"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M16 36h32M25 55V39h14v16" {...common} stroke="#234c72" />
        <path d="m15 24 17-13 17 13" {...common} stroke="#3caf98" />
      </>
    ),
    air: (
      <>
        <circle
          cx="32"
          cy="32"
          r="23"
          fill="#dbf7fa"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M12 32h15m10 0h15M32 12v15m0 10v15"
          {...common}
          stroke="#278eaa"
        />
        <circle
          cx="32"
          cy="32"
          r="6"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M20 20c4-3 8-3 11-2M42 44c-4 3-8 3-11 2"
          {...common}
          stroke="#59b5d5"
        />
      </>
    ),
    power: (
      <>
        <rect
          x="13"
          y="13"
          width="38"
          height="44"
          rx="7"
          fill="#fff5cb"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M25 8h14" {...common} stroke="#234c72" />
        <path
          d="m36 20-12 15h9l-5 12 13-17h-9z"
          fill="#ffc552"
          stroke="#234c72"
          strokeWidth="2"
        />
      </>
    ),
    water: (
      <>
        <path
          d="M32 7C26 17 16 29 16 40a16 16 0 0 0 32 0C48 29 38 17 32 7Z"
          fill="#a8e6fb"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path d="M23 42c2 6 6 8 11 8" {...common} stroke="#fff" />
      </>
    ),
    shield: (
      <>
        <path
          d="M32 7 53 15v15c0 15-10 23-21 28C21 53 11 45 11 30V15Z"
          fill="#d5f8e9"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="m21 32 8 8 16-18"
          {...common}
          stroke="#21aa95"
          strokeWidth="4"
        />
      </>
    ),
    radio: (
      <>
        <path d="M22 51h20M32 51V29" {...common} stroke="#234c72" />
        <circle
          cx="32"
          cy="25"
          r="5"
          fill="#ffcb60"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M20 17c-6 5-6 13 0 18m24-18c6 5 6 13 0 18M14 10C5 18 5 35 14 43m36-33c9 8 9 25 0 33"
          {...common}
          stroke="#278eaa"
        />
      </>
    ),
    grid: (
      <>
        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="6"
          fill="#fff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M20 8v48M32 8v48M44 8v48M8 20h48M8 32h48M8 44h48"
          {...common}
          stroke="#8dbccd"
          strokeWidth="2"
        />
        <path
          d="M9 32h46M32 9v46"
          {...common}
          stroke="#234c72"
          strokeWidth="3"
        />
        <circle cx="14" cy="14" r="3" fill="#ffbd70" />
        <circle cx="38" cy="26" r="3" fill="#55caba" />
        <circle cx="50" cy="38" r="3" fill="#76bcee" />
      </>
    ),
    crystal: (
      <>
        <path
          d="M19 12h26l14 17-27 28L5 29Z"
          fill="#b8d9ff"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M5 29h54M19 12l-7 17 20 28 20-28-7-17M19 12l13 17 13-17"
          {...common}
          stroke="#4d97cc"
          strokeWidth="2"
        />
      </>
    ),
    storm: (
      <>
        <circle
          cx="32"
          cy="31"
          r="12"
          fill="#ffcb60"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="M32 3v9M32 50v11M4 31h10m36 0h10M12 11l7 7m26 26 7 7M52 11l-7 7M19 44l-7 7"
          {...common}
          stroke="#f4a851"
        />
        <path d="M38 19 27 34h8l-6 14" {...common} stroke="#234c72" />
      </>
    ),
    rock: (
      <>
        <path
          d="M7 51 17 25l16-9 18 11 7 24Z"
          fill="#c0d5df"
          stroke="#234c72"
          strokeWidth="3"
        />
        <path
          d="m17 25 12 12-7 14m11-35 2 19 16-8"
          {...common}
          stroke="#8cabb9"
        />
      </>
    ),
    plant: (
      <>
        <path d="M32 54V29" {...common} stroke="#287f75" strokeWidth="4" />
        <path
          d="M32 34C14 35 13 25 14 16c14-1 22 6 18 18Zm0-3c0-15 8-22 20-22 2 12-3 22-20 22Z"
          fill="#a7e9a9"
          stroke="#287f75"
          strokeWidth="3"
        />
        <path d="M17 56h30" {...common} stroke="#287f75" />
      </>
    ),
    spark: (
      <>
        <path
          d="m32 5 5 19 20 8-20 7-5 20-7-20L6 32l19-8Z"
          fill="#ffdc7a"
          stroke="#234c72"
          strokeWidth="3"
        />
      </>
    ),
  } satisfies Record<IconName, React.ReactNode>;
  return (
    <svg
      viewBox="0 0 64 64"
      className={`game-icon ${className}`}
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {art[name]}
    </svg>
  );
}
