# Science sources and simulation limits

ASTRO: Mission Moon paraphrases agency learning material and links to the original pages from the relevant game screens. These sources inform the concepts; the fictional Moon base, resource points, gauge values, time steps, and outcomes are game design choices. A cited source does not validate a numerical game score.

| Topic in ASTRO | Agency resource | Used for |
| --- | --- | --- |
| Suit Check and suit rescue | [NASA: What Is a Spacesuit?](https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-a-spacesuit-grades-5-8/) and [NASA Science: Extravehicular Mobility Unit](https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/) | Oxygen, pressure, cooling, and life support in a suit |
| Water Rescue, Supply Logic, and final rescue | [NASA: Environmental Control and Life Support Systems](https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/) | Water recovery and testing, air cleaning, and oxygen generation |
| Rover Route and storm scenarios | [NASA Science: Protecting Astronauts from Space Radiation at the Moon](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/) | Space-weather planning and shelter |
| Power Challenge | [NASA: Space Station Solar Power](https://www.nasa.gov/missions/station/iss-research/power-up-roll-out-solar-arrays-boost-space-station-power-supply/) | Solar electricity and power prioritization |
| Grow the Crew's Lunch | [NASA: Growing Plants in Space](https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/) | Controlled plant-growth conditions |
| Build a Safe Moon Home | [NASA Space Place: Build a Moon Habitat](https://spaceplace.nasa.gov/moon-habitat/en/) | Habitat needs and airlock sequence; this is an older educational page retained for historical use |
| Space-weather context | [NASA CCMC DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) and the [archived May 10, 2024 flare record](https://ccmc.gsfc.nasa.gov/DONKI/events/30666/2/) | An archived example in a story and optional recent flare reports in Ask Astro |
| Space farming story | [Canadian Space Agency: Interplanetary Farming](https://www.asc-csa.gc.ca/eng/youth-educators/activities/fitness-and-nutrition/interplanetary-farming.asp) | Crop needs and resource tradeoffs |

The structured records for the original three science stories, including dates and specific caveats, are in `src/content/sources.json`. Campaign citations are in `src/Campaign.tsx`; arcade citations are in `src/arcadeQuestions.ts`; Ask Astro links are in `src/astroKnowledge.ts` and `src/AstroChat.tsx`.

The optional `/api/space-weather` route requests the past seven UTC days of NASA DONKI solar-flare reports and caches its response for ten minutes. The app labels them as past reports. A flare class is **not** a radiation dose at the fictional Moon base, and this feature is **not** a safety forecast. The archived flare is similarly context for a practice scenario, not evidence that a crew at a particular location received a particular dose.

An educator should review the final science wording, source currency, and reading level before classroom use.
