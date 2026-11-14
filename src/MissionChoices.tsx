import {
  canAfford,
  formatChange,
  previewChanges,
  type Choice,
  type Game,
} from "./engine";

const gardenQuestions = [
  "The next delivery is far away. Which growing plan should we try?",
  "Earth's reply will take time. How should we decide today?",
  "Our plants need support. Which system should get attention?",
  "The harvest is in. What helps the crew finish safely?",
];

type Props = {
  game: Game;
  choices: Choice[];
  selected: string | null;
  onSelect: (id: string, method: "tap" | "drop") => void;
};

export default function MissionChoices({
  game,
  choices,
  selected,
  onSelect,
}: Props) {
  const cost = (choice: Choice) =>
    formatChange(previewChanges(game.values, choice.immediate));
  if (game.levelId === 2) {
    const chosen = choices.find((choice) => choice.id === selected);
    return (
      <div className="interaction interaction-drag">
        <p className="interaction-instruction">
          Drag a mission tile into the plan. You can also click a tile.
        </p>
        <div
          className={`drop-zone ${chosen ? "filled" : ""}`}
          role="group"
          aria-label="Mission plan drop zone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const id = event.dataTransfer.getData("text/plain");
            if (
              choices.some(
                (choice) => choice.id === id && !canAfford(game, choice),
              )
            )
              onSelect(id, "drop");
          }}
        >
          <span className="drop-icon">{chosen ? "✓" : "↓"}</span>
          <div>
            <strong>{chosen ? chosen.label : "Drop your plan here"}</strong>
            <small>
              {chosen
                ? `${cost(chosen)} · confirm when ready`
                : "What will the crew do this shift?"}
            </small>
          </div>
        </div>
        <div className="choices drag-options">
          {choices.map((choice) => {
            const shortage = canAfford(game, choice);
            return (
              <button
                key={choice.id}
                className={`choice drag-card ${selected === choice.id ? "selected" : ""}`}
                type="button"
                draggable={!shortage}
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/plain", choice.id)
                }
                onClick={() => onSelect(choice.id, "tap")}
                disabled={!!shortage}
                aria-label={`${choice.label}. ${choice.description}. ${cost(choice)}`}
              >
                <span className="drag-handle" aria-hidden="true">
                  ⋮⋮
                </span>
                <span className="choice-copy">
                  <strong>{choice.label}</strong>
                  <small>{choice.description}</small>
                  <em>
                    {cost(choice)}
                    {choice.delayed?.length ? " · later effect" : ""}
                  </em>
                  {shortage && <b>Need more {shortage}</b>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (game.levelId === 3) {
    return (
      <div className="interaction interaction-answers">
        <div className="garden-question">
          <span>ASTRO ASKS</span>
          <strong>{gardenQuestions[game.turn - 1]}</strong>
        </div>
        <div className="choices garden-grid">
          {choices.map((choice, index) => {
            const shortage = canAfford(game, choice);
            return (
              <button
                key={choice.id}
                type="button"
                className={`choice garden-answer ${selected === choice.id ? "selected" : ""}`}
                onClick={() => onSelect(choice.id, "tap")}
                disabled={!!shortage}
              >
                <span className="garden-answer-top">
                  <span className="answer-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="garden-answer-icon" aria-hidden="true">
                    {choice.icon === "food"
                      ? "✿"
                      : choice.icon === "water"
                        ? "◈"
                        : choice.icon === "message"
                          ? "✉"
                          : "ϟ"}
                  </span>
                </span>
                <span className="choice-copy">
                  <strong>{choice.label}</strong>
                  <small>{choice.description}</small>
                  <em>
                    {cost(choice)}
                    {choice.delayed?.length ? " · later effect" : ""}
                  </em>
                  {shortage && <b>Need more {shortage}</b>}
                </span>
                {selected === choice.id && (
                  <span className="answer-picked">MY ANSWER ✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="interaction interaction-cards">
      <p className="interaction-instruction">
        Pick one mission card. Check its cost, then confirm.
      </p>
      <div className="choices">
        {choices.map((choice) => {
          const shortage = canAfford(game, choice);
          return (
            <button
              key={choice.id}
              type="button"
              className={`choice ${selected === choice.id ? "selected" : ""}`}
              onClick={() => onSelect(choice.id, "tap")}
              disabled={!!shortage}
            >
              <span className="choice-symbol" aria-hidden="true">
                {choice.icon === "air"
                  ? "◌"
                  : choice.icon === "power"
                    ? "ϟ"
                    : "⌕"}
              </span>
              <span className="choice-copy">
                <strong>{choice.label}</strong>
                <small>{choice.description}</small>
                <em>
                  {cost(choice)}
                  {choice.delayed?.length ? " · later effect" : ""}
                </em>
                {shortage && <b>Need more {shortage}</b>}
              </span>
              <span className="choice-select" aria-hidden="true">
                {selected === choice.id ? "✓" : "○"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
