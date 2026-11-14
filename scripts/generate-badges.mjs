import { mkdirSync, writeFileSync } from "node:fs";

const badges = [
  {
    id: "first-launch",
    title: ["FIRST", "LAUNCH"],
    main: "#FF775E",
    light: "#FFE4AC",
    icon: `<path d="M160 60c29 26 34 58 22 99l-22 27-22-27c-12-41-7-73 22-99Z" fill="#fff" stroke="#24456D" stroke-width="7"/><circle cx="160" cy="113" r="17" fill="#72D8F3" stroke="#24456D" stroke-width="6"/><path d="m139 153-23 25v22l26-15m39-32 23 25v22l-26-15" fill="#FFF2CE" stroke="#24456D" stroke-width="6" stroke-linejoin="round"/><path d="M149 185q11 45 22 0" fill="#FFD156" stroke="#FF775E" stroke-width="5"/>`,
  },
  {
    id: "air-guardian",
    title: ["AIR", "GUARDIAN"],
    main: "#3ACDC2",
    light: "#D7FBF2",
    icon: `<circle cx="160" cy="132" r="70" fill="#fff" stroke="#245173" stroke-width="7"/><circle cx="160" cy="132" r="15" fill="#FFE174" stroke="#245173" stroke-width="5"/><path d="M158 111q-30-45-7-48 23-3 19 46M180 132q48-30 47-7-1 23-46 19M162 153q29 45 6 48-23 2-19-46M141 133q-49 29-48 6 1-22 46-19" fill="#8FE6DD" stroke="#245173" stroke-width="5"/>`,
  },
  {
    id: "power-planner",
    title: ["POWER", "PLANNER"],
    main: "#FFD04F",
    light: "#FFF1B4",
    icon: `<rect x="104" y="79" width="111" height="111" rx="18" fill="#fff" stroke="#23456D" stroke-width="8"/><rect x="140" y="65" width="39" height="15" rx="5" fill="#23456D"/><path d="m168 91-34 49h25l-9 41 39-56h-25l12-34Z" fill="#FFB535" stroke="#23456D" stroke-width="5" stroke-linejoin="round"/>`,
  },
  {
    id: "crater-cartographer",
    title: ["CRATER", "CARTOGRAPHER"],
    main: "#6CB9FF",
    light: "#D9EDFF",
    icon: `<circle cx="152" cy="140" r="64" fill="#E9F4FF" stroke="#274A70" stroke-width="7"/><ellipse cx="131" cy="125" rx="25" ry="12" fill="#A6C4E3" stroke="#274A70" stroke-width="4"/><ellipse cx="178" cy="157" rx="17" ry="9" fill="#A6C4E3" stroke="#274A70" stroke-width="4"/><path d="M95 90q72-62 135-6" fill="none" stroke="#FFD35C" stroke-width="8" stroke-linecap="round"/><path d="m209 72 24 16-25 11" fill="none" stroke="#FFD35C" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    id: "storm-scout",
    title: ["STORM", "SCOUT"],
    main: "#FF91B8",
    light: "#FFE0EA",
    icon: `<circle cx="160" cy="100" r="31" fill="#FFD458" stroke="#B95B59" stroke-width="6"/><path d="M160 49V37m0 125v-12M109 100H96m128 0h-13m-89-37-9-9m94 94-9-9m0-76 9-9m-94 94 9-9" stroke="#FFD458" stroke-width="8" stroke-linecap="round"/><path d="M113 140q48-18 94 0v30q-20 32-47 44-28-12-47-44Z" fill="#fff" stroke="#24456D" stroke-width="7"/><path d="m139 169 16 14 30-31" fill="none" stroke="#32BFAF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    id: "shelter-hero",
    title: ["SHELTER", "HERO"],
    main: "#77DBA8",
    light: "#E1F9CC",
    icon: `<path d="M89 177q6-83 71-92 65 9 71 92Z" fill="#fff" stroke="#245173" stroke-width="8"/><path d="M108 174q5-56 52-65 47 9 52 65Z" fill="#8ED5E0" stroke="#245173" stroke-width="5"/><circle cx="142" cy="152" r="9" fill="#245173"/><circle cx="177" cy="152" r="9" fill="#245173"/><path d="M82 187h156" stroke="#245173" stroke-width="9" stroke-linecap="round"/><path d="m111 62-18-12m130 12 18-12" stroke="#FFD35C" stroke-width="8" stroke-linecap="round"/>`,
  },
  {
    id: "sun-sleuth",
    title: ["SUN", "SLEUTH"],
    main: "#FFB958",
    light: "#FFF0C3",
    icon: `<circle cx="146" cy="121" r="50" fill="#fff" stroke="#23456D" stroke-width="8"/><circle cx="146" cy="121" r="27" fill="#FFD657" stroke="#F08A4F" stroke-width="5"/><path d="M146 84v-13m0 101v-13m-37-38H96m100 0h-13m-63-27-9-9m71 72-9-9m0-53 9-9m-71 72 9-9" stroke="#F08A4F" stroke-width="6" stroke-linecap="round"/><path d="m181 157 36 36" stroke="#23456D" stroke-width="15" stroke-linecap="round"/><path d="m215 191 14 14" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`,
  },
  {
    id: "garden-pilot",
    title: ["GARDEN", "PILOT"],
    main: "#75D995",
    light: "#E5F9C6",
    icon: `<rect x="91" y="154" width="138" height="52" rx="12" fill="#fff" stroke="#245173" stroke-width="7"/><path d="M160 160V93" stroke="#245173" stroke-width="8" stroke-linecap="round"/><path d="M158 120q-43 2-39-37 42-6 39 37Zm5-10q1-42 44-39 2 43-44 39Z" fill="#53CE8D" stroke="#245173" stroke-width="5"/><path d="M111 184h98" stroke="#95D4EA" stroke-width="6" stroke-linecap="round"/><circle cx="112" cy="62" r="8" fill="#FFD157"/>`,
  },
  {
    id: "water-wizard",
    title: ["WATER", "WIZARD"],
    main: "#65C9F2",
    light: "#D8F5FF",
    icon: `<path d="M160 60q55 66 55 103a55 55 0 0 1-110 0q0-37 55-103Z" fill="#fff" stroke="#24456D" stroke-width="8"/><path d="M131 168q8 22 30 22" fill="none" stroke="#72D4ED" stroke-width="8" stroke-linecap="round"/><path d="m119 91 10-19 19 9m45 76-8 22-21-8" fill="none" stroke="#1CBDAF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M124 78q22-22 48-17m18 111q-25 24-53 18" fill="none" stroke="#1CBDAF" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: "tradeoff-thinker",
    title: ["TRADE-OFF", "THINKER"],
    main: "#B9A0F4",
    light: "#EDE6FF",
    icon: `<path d="M160 77v112m-59 6h118M111 100h98" stroke="#24456D" stroke-width="8" stroke-linecap="round"/><circle cx="160" cy="77" r="12" fill="#FFD55F" stroke="#24456D" stroke-width="5"/><path d="m111 103-29 51h58Zm98 0-29 51h58Z" fill="#fff" stroke="#24456D" stroke-width="6" stroke-linejoin="round"/><path d="m111 116-14 25h28Zm98 0-14 25h28Z" fill="#65D5CA"/><path d="m160 47 4 8 9 2-7 6 2 9-8-4-8 4 2-9-7-6 9-2Z" fill="#FFD55F"/>`,
  },
];

mkdirSync("public/badges", { recursive: true });
for (const badge of badges) {
  const [first, second] = badge.title;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 340" role="img" aria-labelledby="title">
<title id="title">${badge.title.join(" ")}</title>
<defs><linearGradient id="medal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${badge.light}"/><stop offset="1" stop-color="${badge.main}"/></linearGradient></defs>
<path d="M70 201 51 265l62-19 32 30 13-51M250 201l19 64-62-19-32 30-13-51" fill="${badge.main}" stroke="#24456D" stroke-width="6" stroke-linejoin="round"/>
<circle cx="160" cy="139" r="122" fill="#D8E6EE" stroke="#24456D" stroke-width="7"/><circle cx="160" cy="132" r="118" fill="url(#medal)" stroke="#fff" stroke-width="8"/><circle cx="160" cy="132" r="102" fill="none" stroke="#24456D" stroke-opacity=".20" stroke-width="4" stroke-dasharray="9 10"/>
<circle cx="53" cy="89" r="8" fill="#fff" opacity=".9"/><circle cx="266" cy="80" r="6" fill="#fff" opacity=".9"/><path d="m55 183 5 9 10 4-10 4-5 9-5-9-10-4 10-4Zm209-34 4 8 9 4-9 4-4 8-4-8-9-4 9-4Z" fill="#fff" opacity=".92"/>
${badge.icon}
<path d="M25 254q135-22 270 0v67q-135 25-270 0Z" fill="#fff" stroke="#24456D" stroke-width="7" stroke-linejoin="round"/><path d="M37 266q123-17 246 0" fill="none" stroke="${badge.main}" stroke-width="7" stroke-linecap="round"/>
<text x="160" y="292" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-size="26" font-weight="900" letter-spacing="1.2" fill="#24456D">${first}</text>
<text x="160" y="318" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-size="${second.length > 11 ? 19 : 25}" font-weight="900" letter-spacing="1" fill="#24456D">${second}</text>
</svg>`;
  writeFileSync(`public/badges/${badge.id}.svg`, svg, "utf8");
}
