import { badges } from "./badges";

export type ChatContext = {
  page: string;
  arcadeId: number;
  levelId: number;
  turn: number;
  xp: number;
  streak: number;
  arcadeDone: number;
  scienceDone: number;
  badges: number;
};
export type ChatLink = { label: string; url: string };
export type ChatAnswer = {
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
  live?: boolean;
};

const life: ChatLink = {
  label: "NASA · Life support systems",
  url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/",
};
const shelter: ChatLink = {
  label: "NASA · Space radiation and shelter",
  url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/",
};
const farming: ChatLink = {
  label: "Canadian Space Agency · Interplanetary Farming",
  url: "https://www.asc-csa.gc.ca/eng/youth-educators/activities/fitness-and-nutrition/interplanetary-farming.asp",
};
const suit: ChatLink = {
  label: "NASA Science · Spacewalking suit",
  url: "https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/",
};
const power: ChatLink = {
  label: "NASA · Space station solar power",
  url: "https://www.nasa.gov/missions/station/iss-research/power-up-roll-out-solar-arrays-boost-space-station-power-supply/",
};

export function chatSuggestions(context: ChatContext): string[] {
  if (context.page === "arcade") {
    return [
      [
        "How do I rescue the astronaut?",
        "How does this grid work?",
        "Help me drive the rover",
        "How do I make a match?",
        "What should I do in the storm?",
      ][context.arcadeId - 1],
      "Why does this matter in space?",
      "What happens after a wrong move?",
      "Show recent NASA flares",
    ];
  }
  if (
    context.page === "mission" ||
    context.page === "intro" ||
    context.page === "consequence"
  )
    return [
      "What should I do next?",
      "Explain this resource trade-off",
      "Why plan for the next shift?",
      "Show a science source",
    ];
  if (context.page === "badges")
    return [
      "How do I earn badges?",
      "What do my points mean?",
      "Show a science source",
    ];
  return [
    "What should I play next?",
    "How do astronauts get air?",
    "How does the XP bar work?",
    "Show recent NASA flares",
  ];
}

export function answerAstro(
  question: string,
  context: ChatContext,
): ChatAnswer {
  const q = question.toLowerCase().trim();
  if (
    /(recent|latest|live|today|now).*(flare|space weather)|show recent nasa flares|nasa flares/.test(
      q,
    )
  )
    return {
      text: "I'll check NASA's recent solar-flare reports. These are past observations, not a safety forecast for our Moon crew.",
      live: true,
    };
  if (/(points|xp|streak|score|stars)/.test(q))
    return {
      text: `You have ${context.xp} XP and a ${context.streak}-day practice streak. Each new correct step sends a star to the XP bar; 100 XP fills one level. You have finished ${context.arcadeDone} of 5 rescue games and ${context.scienceDone} science stories. Your learning progress stays on this device when you refresh.`,
      suggestions: ["What should I play next?", "How do I earn badges?"],
    };
  const namedBadge = badges.find((badge) =>
    q.includes(badge.title.toLowerCase()),
  );
  if (namedBadge)
    return {
      text: `${namedBadge.title}: ${namedBadge.criterion} ${namedBadge.description}`,
      suggestions: ["How do I earn badges?"],
    };
  if (/(badge|reward)/.test(q))
    return {
      text: `You have ${context.badges} badges. Finish the science stories to collect the first badges, then replay with different air, power, and water strategies to earn the rest. Tap any badge to see its exact goal.`,
      suggestions: ["What should I play next?"],
    };
  if (/(wrong move|wrong answer|mistake|fail|try again)/.test(q))
    return {
      text: "A red flash means that move did not help the crew. Read the short clue, try a different supply or answer, and watch which resource changes. Mistakes do not remove XP; the same correct step only awards XP once in this run.",
      suggestions: ["What should I do next?", "Why does this matter in space?"],
    };
  if (/(next shift|future shift|later|consequence|trade-off|tradeoff)/.test(q))
    return {
      text: "A resource trade-off means one helpful action uses something another action needs. For example, using power for a scan can leave less for the air recycler. The next shift reveals a later effect, so check both the immediate cost and what the crew will need afterward. ASTRO's resource points are fictional.",
      links: [life],
      suggestions: ["How do astronauts get air?", "What should I do next?"],
    };
  if (/(why.*shield|how.*shield|why.*shelter)/.test(q))
    return {
      text: "When energetic particles from the Sun are a concern, NASA describes moving astronauts into a more shielded part of the spacecraft or habitat and postponing outside work. In the storm game, put the shield at the shelter and contact the crew. The game does not calculate a real radiation dose.",
      links: [shelter],
      suggestions: ["What is a solar flare?", "Show recent NASA flares"],
    };
  if (/(what is a solar flare|flare mean|flare class|what.*space weather)/.test(q))
    return {
      text: "A solar flare is a sudden release of energy from the Sun. NASA's DONKI report lists observed events and flare classes. A flare report alone cannot tell us the dose at a Moon habitat; a real crew uses mission-specific space-weather information.",
      links: [shelter, { label: "NASA CCMC · DONKI", url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/" }],
      suggestions: ["Show recent NASA flares", "Why use a shelter?"],
    };
  if (/(oxygen.*water|water.*oxygen|make oxygen|air recycler|carbon dioxide)/.test(q))
    return {
      text: "NASA's station life-support system includes equipment that makes oxygen from recovered water and equipment that removes carbon dioxide from cabin air. Those are different jobs. In our rescue game, the oxygen pack is a quick supply for a stranded astronaut; the habitat systems support the crew over time.",
      links: [life],
      suggestions: ["How is water reused?", "Why plan for the next shift?"],
    };
  if (/(why.*plant.*light|why.*crop.*light|how.*plant.*grow|grow.*without.*soil)/.test(q))
    return {
      text: "Plants use light to grow, but they also need water, air, the right temperature, and time. A future space farm must manage these together. In ASTRO, a grow-box choice cannot feed the crew immediately because harvesting takes time.",
      links: [farming],
      suggestions: ["Why plan for the next shift?", "How is water reused?"],
    };
  if (/(why does this matter|show a science source)/.test(q)) {
    const topic =
      context.page === "arcade"
        ? context.arcadeId
        : context.levelId === 2
          ? 5
          : context.levelId === 3
            ? 4
            : 1;
    if (topic === 5)
      return {
        text: "A space-weather warning may change where astronauts work. NASA describes postponing outside activity and using a more shielded area when solar energetic particles are a concern. This game is a practice scenario, not a dose estimate.",
        links: [shelter],
      };
    if (topic === 3)
      return {
        text: "A spacewalking suit is a mobile life-support system with oxygen, electrical power, cooling, and ventilation. That is why the rover game asks you to collect breathing support before reaching the crewmate. The route is fictional.",
        links: [suit],
      };
    if (topic === 4)
      return {
        text: "NASA says station solar power supports life support, daily activities, and research. The match-three board is a playful power-budget exercise; matching tiles does not create real electricity.",
        links: [power],
      };
    return {
      text: "NASA's station life-support system manages air, oxygen, and water. That is why we practice keeping supplies and working systems ready for the crew.",
      links: [life],
    };
  }
  if (
    /(help|stuck|next|do i|how do i|how does this|make a match|rescue the astronaut|drive the rover|what should.*storm)/.test(
      q,
    ) &&
    !/(radiation|solar|flare|weather|science|why)/.test(q)
  ) {
    if (context.page === "arcade") {
      const tips = [
        "Tap or drag a supply to the picture it helps. Start with the oxygen pack and the astronaut. The tray shows what is still missing.",
        "Each row, column, and 2×2 box needs one air, power, water, and shield symbol. Choose a symbol, then tap an empty square. A repeated symbol is a clue to try another place.",
        "Use the arrow buttons or keyboard arrows. First pick up the oxygen pack, then guide the rover around rocks to the astronaut.",
        "Swap two neighboring tiles. Look for two matching symbols with a different tile between them. Move a third matching symbol into that gap.",
        "The storm scene needs a shield at the shelter, a radio with the crew, and a charge pack at the habitat. Tap a supply then its destination, or drag it.",
      ];
      return {
        text: tips[context.arcadeId - 1],
        suggestions: [
          "Why does this matter in space?",
          "What do my points mean?",
        ],
      };
    }
    if (
      context.page === "mission" ||
      context.page === "intro" ||
      context.page === "consequence"
    ) {
      const tips = [
        "Keep the air system running while leaving enough power for a science scan. Check the cost shown on each card before you confirm.",
        "During the storm scenario, protect the crew first. You can still do science indoors after sheltering.",
        "The grow box needs water, light, and time. Check what the crew will use before the harvest arrives.",
      ];
      return {
        text: `${tips[context.levelId - 1]} You are on shift ${context.turn}.`,
        suggestions: [
          "Explain this resource trade-off",
          "Show a science source",
        ],
      };
    }
    return {
      text: "All five rescue games are open on the Mission map. Pick any card that looks fun. The science stories below them build a longer Moon-base plan.",
      suggestions: ["How do astronauts get air?", "What do my points mean?"],
    };
  }
  if (/(radiation|solar|flare|weather|shield|shelter)/.test(q))
    return {
      text: "A space-weather warning can change a crew's plan. NASA describes postponing outside work and moving into a more shielded area when solar energetic particles are a concern. Our game safety gauge is not a radiation dose.",
      links: [shelter],
      suggestions: ["Show recent NASA flares", "What should I do next?"],
    };
  if (/(plant|crop|garden|grow|food|harvest|light)/.test(q))
    return {
      text: "Space crops need the right light, water, air, temperature, and time to harvest. That is why the game makes you plan the grow box before the food arrives. Our harvest points are invented for practice.",
      links: [farming],
      suggestions: ["What should I do next?"],
    };
  if (/(water|recycl)/.test(q))
    return {
      text: "NASA's station Water Recovery System cleans water collected from several sources, including cabin humidity. Clean water can be reused. The Moon habitat in this game is fictional, so its water points are not NASA measurements.",
      links: [life],
      suggestions: ["How do astronauts get air?"],
    };
  if (
    /(air|oxygen|breath|power|battery|electric|resource|trade-off|tradeoff|science source|why does this matter)/.test(
      q,
    )
  )
    return {
      text: "NASA's station life-support systems control cabin air and water. Its oxygen-generation equipment separates recovered water into oxygen and hydrogen. In the game, using power for one task can leave less for another, so check the next shift too.",
      links: [life],
      suggestions: ["What should I do next?", "How is water reused?"],
    };
  return {
    text: "I can help with the current level, air, water, crops, space weather, points, and badges. Try one of these short questions, and I'll show the source when I explain real science.",
    suggestions: chatSuggestions(context),
  };
}
