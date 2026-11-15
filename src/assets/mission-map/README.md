# ASTRO: Mission Moon — map art handoff

`mission-map-concept.png` is a visual design target, not a flattened production UI. Build the title, labels, buttons, progress, hit areas, and path in HTML/CSS/SVG so they remain readable, responsive, and interactive.

## Assets

All nine landmark/character PNGs have transparent corners and can be layered over a lunar landscape. The seven mission images are each 1536 × 1024. Astro is 1312 × 1199. The final base is 1536 × 1024 but should display at roughly **1.7–2× the visual size** of an ordinary landmark. The concept image is 1672 × 941.

| File | Role | Suggested display width at 1672 px viewport |
|---|---|---:|
| `astro-mascot.png` | Current position and guidance | 110–160 px |
| `mission-01-suit-check.png` | Mission 1 | 170–220 px |
| `mission-02-water-rescue.png` | Mission 2 | 170–220 px |
| `mission-03-supply-logic.png` | Mission 3 | 170–220 px |
| `mission-04-rover-route.png` | Mission 4 | 170–220 px |
| `mission-05-power-challenge.png` | Mission 5 | 170–220 px |
| `mission-06-greenhouse.png` | Mission 6 | 170–220 px |
| `mission-07-safe-moon-home.png` | Mission 7 | 170–220 px |
| `final-rescue-moon-base.png` | Final challenge | 350–430 px |

Use `object-fit: contain` and inspect each asset's transparent padding when setting its CSS box size. Keep the final base at the end of the route with its own spacious region, gold lighting, and larger label.

## Flow and placement

Follow the visual journey: Suit Check → Water Rescue → Supply Logic → Rover Route → Power Challenge → Grow the Crew's Lunch → Build a Safe Moon Home → Rescue the Moon Base. `mission-route.svg` provides a transparent, scalable route overlay. Place it behind the landmark layer, then overlay mission buttons, number badges, labels, and focus rings as real UI elements. The SVG path has an `id` for a traveling marker or progress animation. On smaller viewports, create a vertically scrolling route rather than shrinking all landmarks and text to fit one screen.

## Motion direction

| Event | Map response |
|---|---|
| Map opens | Stars fade in, route traces from Mission 1 to the current stop, then landmarks appear in sequence. |
| Landmark hover/focus | Landmark rises 4–8 px; local lights brighten; name card appears. Keyboard focus gets the same response. |
| Landmark selected | Route to that stop brightens and Astro turns toward it; bottom panel updates. |
| Start mission | Astro points forward, a light travels from the current stop into the destination, then the level scene expands from that landmark. |
| Mission completed | Landmark lights switch on, badge fills with a star, path segment draws toward the next stop, Astro travels along it. |
| Mission needs retry | Amber beacon pulses twice; show a calm explanation and replay action. No flashing red screen. |
| Final challenge unlocked | Gold ring around the final base illuminates in stages, dome lights rise, a single starburst plays, and the final label appears. |
| Reduced motion | Replace travel and parallax with short fades and immediate clear state changes. |

Use small CSS/SVG transforms for hover, focus, and path progress. The PNGs are **static art assets**: their internal lights, wheels, doors, crops, and Astro's limbs cannot move independently without layered redraws or a rigged animation asset. Create separate layers or Rive assets for those close-up animations.

## Image generation prompts used

Full map: a high-fidelity children's lunar mission map replacing the supplied card grid, with a winding route through seven illustrated landmarks, a visibly larger golden final-base destination, Astro at the first stop, concise HUD, and selected-mission dock.

Separate assets: each landmark was generated as a transparent, isolated, three-quarter-view 2D game illustration matched to the full map's navy, cyan, cream, and gold art direction. Astro was generated as an original pointing and waving astronaut character.

Generation method: built-in image generation tool. The source screenshot was used as a reference for the redesign; the generated map concept was used as the visual reference for the separate assets.
