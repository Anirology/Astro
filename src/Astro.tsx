export type AstroMood =
  | "idle"
  | "wave"
  | "point"
  | "think"
  | "celebrate"
  | "concerned"
  | "explain"
  | "sleep";

export default function Astro({
  mood = "idle",
  small = false,
}: {
  mood?: AstroMood;
  small?: boolean;
}) {
  const smiling = mood === "wave" || mood === "celebrate" || mood === "explain";
  const leftArm =
    mood === "wave"
      ? "M47 109Q27 101 23 84L18 77"
      : mood === "think"
        ? "M47 110Q32 110 44 90"
        : "M48 107Q28 96 25 113L43 126";
  const rightArm =
    mood === "point" || mood === "explain"
      ? "M137 108Q154 96 164 79L171 73"
      : mood === "celebrate"
        ? "M138 107Q157 96 165 83"
        : "M139 105Q158 95 161 111L141 128";
  return (
    <svg
      className={`astro astro--${mood} ${small ? "astro-small" : ""}`}
      viewBox="0 0 180 180"
      role="img"
      aria-label={`Astro the explorer, ${mood}`}
    >
      <ellipse
        className="astro-shadow"
        cx="90"
        cy="160"
        rx="53"
        ry="8"
        fill="#102447"
        opacity=".15"
      />
      <path
        className="astro-antenna"
        d="M83 33Q79 17 99 11L95 22L111 17Q103 35 88 38"
        fill="#48c8c0"
      />
      <path
        d="M61 131L52 157Q70 165 78 153L79 137M111 135L116 156Q135 164 139 151L125 127"
        fill="#d9e9e7"
        stroke="#234062"
        strokeWidth="4"
      />
      <path
        d="M40 76Q33 46 56 37Q88 22 120 39Q146 49 143 83L137 128Q128 151 91 153Q53 150 43 126Z"
        fill="#f9f7ef"
        stroke="#234062"
        strokeWidth="5"
      />
      <path
        d="M45 69Q49 47 77 43L122 47Q138 51 137 69L130 96Q103 111 51 94Z"
        fill="#1c385b"
      />
      <path
        d="M58 65Q89 49 122 59"
        fill="none"
        stroke="#75d5d1"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".75"
      />
      {mood === "sleep" ? (
        <>
          <path
            d="M69 78Q77 84 84 78M103 78Q111 84 118 78"
            fill="none"
            stroke="#f9f7ef"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="136" y="55" fill="#75d5d1" fontSize="20" fontWeight="900">
            z
          </text>
        </>
      ) : (
        <>
          <circle
            cx="77"
            cy="77"
            r={mood === "concerned" ? 5 : 4}
            fill="#f9f7ef"
          />
          <circle
            cx="110"
            cy="77"
            r={mood === "concerned" ? 5 : 4}
            fill="#f9f7ef"
          />
        </>
      )}
      {mood === "concerned" ? (
        <path
          d="M88 92Q96 85 104 92"
          stroke="#f9f7ef"
          strokeWidth="3"
          fill="none"
        />
      ) : mood === "think" ? (
        <circle cx="96" cy="89" r="2.5" fill="#f9f7ef" />
      ) : (
        <path
          d={smiling ? "M86 87Q96 101 106 86" : "M88 88Q96 96 104 87"}
          stroke="#f9f7ef"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mood === "concerned" && (
        <path
          d="M70 65L81 68M104 68L116 65"
          stroke="#f9f7ef"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      <path
        className="astro-left-arm"
        d={leftArm}
        fill="none"
        stroke="#234062"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="astro-right-arm"
        d={rightArm}
        fill="none"
        stroke="#234062"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="astro-left-arm"
        d={leftArm}
        fill="none"
        stroke="#f9f7ef"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="astro-right-arm"
        d={rightArm}
        fill="none"
        stroke="#f9f7ef"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="astro-chest-star"
        d="m91 112 4 7 8 1-6 6 2 8-8-4-7 4 1-8-6-6 8-1Z"
        fill="#f4c95d"
      />
      <circle className="astro-spark" cx="36" cy="47" r="4" fill="#f4c95d" />
      <circle className="astro-spark" cx="150" cy="40" r="3" fill="#75d5d1" />
      {mood === "celebrate" && (
        <>
          <path
            className="astro-spark"
            d="m20 36 4 8 8 4-8 4-4 8-4-8-8-4 8-4Z"
            fill="#f4c95d"
          />
          <path
            className="astro-spark"
            d="m151 13 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"
            fill="#29b6b0"
          />
        </>
      )}
      {mood === "point" && (
        <path
          d="M148 62L172 47M159 73L176 72"
          stroke="#f4c95d"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
