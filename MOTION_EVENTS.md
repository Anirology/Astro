# Motion event map

The campaign uses the same state sequence in all eight missions: `brief → predict → act → changed → done`. A wrong action stays in `act` or `changed` until the learner tries another choice. Astro changes from `point` to `concerned` on a mistake and to `celebrate` on a repair. The labeled system gauge changes from `normal` to `caution` or `repaired`; the number and text remain readable when motion is reduced.

| Event | Visual response | Sound | Reduced motion |
| --- | --- | --- | --- |
| Focus or hover on a choice | Raised card and brighter border | None | Border remains |
| Select prediction | Selected outline | Pick cue | Outline remains |
| Incorrect choice | Amber card, gauge caution, causal explanation | Gentle retry cue | Static amber label and explanation |
| Correct choice | Mint card, gauge fills, Astro celebrates | Repair cue | Static repaired label and explanation |
| XP award | Star travels toward the meter, then the fill grows | XP chime | Meter and number update directly |
| Mission complete | Astro celebrates and the takeaway appears | Level cue | Static takeaway and stars |

Further animation work: drawn system flow paths, interactive suit and habitat diagrams, rover travel, water droplets, plant growth, and scene transitions. The current campaign uses illustrated panels and decisions for these concepts.

## Mission map

The map has a separate focus and selection state for all eight landmarks. On entry, landmarks appear in route order and stars twinkle. The provided route geometry is drawn as an inline SVG path with `id="mission-route"`; a second stroke shows completed progress. Hover and keyboard focus lift each landmark and brighten its outline. Selection updates the real HTML mission dock. Starting a mission briefly brightens the path before opening gameplay. Completing a mission moves the route progress and Astro to the next stop when the map opens. The final base is locked until the first seven are learned. Reduced motion removes these transitions while keeping labels, progress, and focus rings visible.
