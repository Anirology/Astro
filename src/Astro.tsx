export type AstroMood = "idle" | "wave" | "point" | "think" | "celebrate" | "concerned" | "explain" | "sleep";

export default function Astro({ mood = "idle", small = false }: { mood?: AstroMood; small?: boolean }) {
  const talk = mood === "explain" || mood === "point" || mood === "wave";
  const left = mood === "wave" || mood === "celebrate" ? "M57 119Q34 113 29 86" : mood === "think" ? "M57 124Q34 119 60 88" : "M56 121Q37 126 35 141";
  const right = mood === "point" || mood === "explain" ? "M125 119Q145 115 157 93" : mood === "celebrate" ? "M124 118Q146 108 151 83" : "M125 122Q144 126 146 141";
  return <svg className={`astro astro--${mood} ${small ? "astro-small" : ""}`} viewBox="0 0 180 190" role="img" aria-label={`Astro the spacesuit explorer, ${mood}`} strokeLinecap="round" strokeLinejoin="round">
    <ellipse className="astro-shadow" cx="90" cy="179" rx="48" ry="7" fill="#193c63" opacity=".14" />
    <rect x="46" y="101" width="90" height="51" rx="18" fill="#ffcb65" stroke="#204363" strokeWidth="4" />
    <path d="M67 144 61 173Q70 182 83 174L86 147M99 146 100 174Q113 181 124 173L115 143" fill="#f8fbff" stroke="#204363" strokeWidth="4" />
    <path d="M62 168h21m18 0h21" stroke="#50c8c1" strokeWidth="7" />
    <path d="M57 108Q90 97 123 108L126 146Q92 162 55 146Z" fill="#fffaf0" stroke="#204363" strokeWidth="4" />
    <path d="M58 143q34 11 65 0" stroke="#86dcd6" strokeWidth="7" />
    {[left, right].map((d,i) => <g key={i} className={i ? "astro-right-arm" : "astro-left-arm"}><path d={d} fill="none" stroke="#204363" strokeWidth="17" /><path d={d} fill="none" stroke="#f8fbff" strokeWidth="10" /></g>)}
    <rect x="70" y="118" width="41" height="25" rx="8" fill="#d9f5f3" stroke="#204363" strokeWidth="3" />
    <path className="astro-chest-star" d="m83 122 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1Z" fill="#ffbd44" />
    <circle cx="100" cy="126" r="3" fill="#ff7b6e" /><path d="M97 135h7" stroke="#159b98" strokeWidth="3" />
    <path d="M53 49V33" stroke="#204363" strokeWidth="4" /><circle className="astro-antenna" cx="53" cy="28" r="6" fill="#ffcb65" stroke="#204363" strokeWidth="3" />
    <rect x="29" y="60" width="18" height="34" rx="8" fill="#57cfc6" stroke="#204363" strokeWidth="4" />
    <rect x="133" y="60" width="18" height="34" rx="8" fill="#57cfc6" stroke="#204363" strokeWidth="4" />
    <path d="M37 73Q34 28 89 24Q144 27 144 72L139 95Q128 117 90 118Q48 116 39 96Z" fill="#fffaf0" stroke="#204363" strokeWidth="5" />
    <path d="M47 70Q45 40 89 38Q132 40 134 70L130 89Q119 103 90 104Q60 104 49 90Z" fill="#173d60" stroke="#75d8d4" strokeWidth="4" />
    <path d="M57 57Q72 46 92 47" fill="none" stroke="#a1ede5" strokeWidth="4" opacity=".6" />
    <g className="astro-eyes">
      {mood === "sleep" || mood === "celebrate" ? <path d={mood === "sleep" ? "M64 76q6 6 12 0m27 0q6 6 12 0" : "M63 78q7-12 14 0m25 0q7-12 14 0"} fill="none" stroke="#fff" strokeWidth="4" /> : <>
        <ellipse cx="70" cy="76" rx={mood === "concerned" ? 7 : 6} ry="9" fill="#fff" /><ellipse cx="109" cy="76" rx="6" ry={mood === "think" ? 6 : 9} fill="#fff" />
        <circle cx={mood === "think" ? 73 : 71} cy="77" r="3" fill="#173d60" /><circle cx={mood === "think" ? 112 : 110} cy="77" r="3" fill="#173d60" />
      </>}
    </g>
    <path d={mood === "concerned" ? "M62 62l14 4m27 0 13-4" : mood === "think" ? "M63 63h12m27-4 13 4" : "M63 63q7-4 13 0m27 0q7-4 13 0"} fill="none" stroke="#8be0db" strokeWidth="3" />
    <ellipse cx="58" cy="88" rx="6" ry="3" fill="#f68f9a" opacity=".7" /><ellipse cx="122" cy="88" rx="6" ry="3" fill="#f68f9a" opacity=".7" />
    <g className={talk ? "astro-talking-mouth" : "astro-mouth"}>
      {mood === "concerned" ? <path d="M82 94q8-8 16 0" fill="none" stroke="#fff" strokeWidth="3" /> : mood === "think" || mood === "sleep" ? <ellipse cx="90" cy="92" rx="4" ry="3" fill="#fff" /> : <><path d="M79 87Q90 91 102 87Q101 102 90 101Q80 100 79 87" fill="#fff" /><path d="M83 97q7-5 15 0-8 7-15 0" fill="#ff9ba7" /></>}
    </g>
    {mood === "celebrate" && <g className="astro-spark" fill="#ffcb65"><path d="m20 40 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" /><path d="m155 21 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" /></g>}
    {mood === "sleep" && <text x="148" y="45" fill="#159b98" fontSize="22" fontWeight="900">z</text>}
  </svg>;
}
