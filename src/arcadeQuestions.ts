export type ArcadeQuestion = {
  scene: string;
  briefing: string;
  takeaway: string;
  question: string;
  answers: [string, string, string];
  correct: number;
  wrongFeedback: [string, string, string];
  explanation: string;
  source: { label: string; url: string; date: string };
};

const suit = {
  label: "NASA Science · Extravehicular Mobility Unit",
  url: "https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/",
  date: "Published 26 Mar 2025",
};
const life = {
  label: "NASA · Environmental Control and Life Support Systems",
  url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/",
  date: "NASA reference",
};
const power = {
  label: "NASA · Space station solar power",
  url: "https://www.nasa.gov/missions/station/iss-research/power-up-roll-out-solar-arrays-boost-space-station-power-supply/",
  date: "Published 15 Oct 2026",
};
const radiation = {
  label: "NASA Science · Protecting astronauts from space radiation",
  url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/",
  date: "Published 7 Aug 2019",
};

export const arcadeQuestions: ArcadeQuestion[] = [
  {
    scene: "A crewmate is outside the airlock and needs a safe route home.",
    briefing: "A spacewalking suit acts like a small spacecraft. Its life-support equipment carries oxygen, uses electrical power, and helps keep the astronaut safe outside.",
    takeaway: "A space suit is a tiny life-support system: oxygen and power both matter while someone is outside.",
    question: "Why did Astro send oxygen to the astronaut and power to the rover?",
    answers: [
      "The astronaut needs breathing support, and the rover needs electricity to move",
      "The rover makes oxygen for the astronaut while it drives",
      "The door seal makes the suit's power supply work",
    ],
    correct: 0,
    wrongFeedback: ["", "A rover transports gear; it does not make oxygen for a space suit.", "A door seal helps protect the airlock, but it does not power a suit."],
    explanation: "NASA describes a space suit as a mobile life-support system with oxygen and electrical power. Our rescue gear is simplified for the game; real crews follow trained procedures.",
    source: suit,
  },
  {
    scene: "The crew sorts air, power, water, and shielding into rescue lockers.",
    briefing: "Each supply has a different job. NASA's station life-support system cleans cabin air, makes oxygen, and recovers water, including water collected from cabin humidity.",
    takeaway: "Air, water, power, and shielding are different needs. Recovered cabin moisture can be cleaned and reused as water.",
    question: "The crew finds water collected from cabin humidity. What should they do with it?",
    answers: [
      "Send it through the Water Recovery System for cleaning and reuse",
      "Send it straight to the oxygen system without cleaning",
      "Treat it as fresh drinking water without checking it",
    ],
    correct: 0,
    wrongFeedback: ["", "NASA says recovered water is purified and checked before reuse.", "Collected humidity is wastewater until it has been cleaned and checked."],
    explanation: "NASA's Water Recovery System reclaims cabin humidity and other wastewater, cleans it, checks its quality, and stores usable water.",
    source: life,
  },
  {
    scene: "The rover is driving toward a crewmate outside the habitat.",
    briefing: "A spacewalking suit needs its own oxygen supply. In this simplified rescue route, the rover must collect the oxygen pack before reaching the astronaut.",
    takeaway: "Plan the route around the crew's needs: take breathing support before heading to a crewmate outside.",
    question: "Why collect the oxygen pack before the rover reaches the crewmate?",
    answers: [
      "A person outside needs a working oxygen supply as part of suit life support",
      "Oxygen makes the rover's wheels turn faster",
      "The pack tells the rover which arrow to press",
    ],
    correct: 0,
    wrongFeedback: ["", "The pack is for the astronaut's breathing support, not the rover's wheels.", "You choose the route; the pack is a life-support supply."],
    explanation: "NASA describes a space suit as a mobile life-support system with an oxygen supply. This route is a fictional planning exercise, not a real rescue procedure.",
    source: suit,
  },
  {
    scene: "The rescue beacon needs energy, and the habitat still needs power.",
    briefing: "NASA says solar power on the space station supports life-support systems, daily activities, and research. Matching supply tiles is our playful way to plan a shared power budget.",
    takeaway: "Electric power supports many systems. A crew has to plan enough for life support as well as optional tasks.",
    question: "Why should the crew check habitat power before charging the beacon?",
    answers: [
      "Life-support systems also need electricity, so the crew must plan the shared supply",
      "A matching row creates real solar electricity by itself",
      "The beacon can replace every life-support system",
    ],
    correct: 0,
    wrongFeedback: ["", "Matching tiles is a game mechanic. Real electricity comes from the power system.", "A beacon can call for help, but it cannot replace life support."],
    explanation: "NASA reports that station solar power supports life support, daily work, and research. The match-three board and its power points are fictional.",
    source: power,
  },
  {
    scene: "A space-weather warning reaches the crew before outside work.",
    briefing: "NASA describes moving to a more shielded area when solar energetic particles are a concern. Contacting the crew and keeping habitat systems powered helps the team carry out the plan.",
    takeaway: "During a possible solar particle event, the crew should use a more shielded place and coordinate their response.",
    question: "Which plan best protects the crew during this warning?",
    answers: [
      "Gather in a more shielded area and postpone outside work",
      "Open the shelter so everyone can see the Sun",
      "Continue the outside task because a warning is not a measured dose",
    ],
    correct: 0,
    wrongFeedback: ["", "Opening the shelter would remove a barrier between the crew and outside conditions.", "A warning needs a cautious response; it is not a reason to ignore the risk."],
    explanation: "NASA describes postponing outside work and using more shielding when solar energetic particles are a concern. This game does not measure radiation dose.",
    source: radiation,
  },
];
