// Lantern Hunt — screenshot staging behind ?shot=cover|harbour|victory|start.
// Each scene sets the real game state (the same fields a player would reach)
// and returns the screen to paint, so every screenshot is a real render of
// the game's own code at a moment a player could see.
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_VICTORY } from './config.js';
import { SCENES } from './scenes.js';

/** Mark differences by id as found, in order, on the game's state. */
function markFound(game, ids) {
  for (const id of ids) game.state.found.add(id);
}

export function stageShot(name, game) {
  const { state } = game;
  if (name === 'harbour') {
    game.startLevel(1);
    markFound(game, ['sun', 'sail']);
    state.timeLeft = 118;
    state.score = 210;
    state.combo = 2;
    state.hintsLeft = 2;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'victory') {
    game.startLevel(2);
    markFound(game, SCENES[2].differences.map((diff) => diff.id));
    state.score = 2140;
    state.best = 2140;
    state.screen = SCREEN_VICTORY;
    return { screen: SCREEN_VICTORY };
  }
  if (name === 'start') {
    state.levelIndex = 0;
    state.found = new Set();
    state.hintsLeft = 3;
    state.timeLeft = SCENES[0].timeLimit;
    state.score = 0;
    state.screen = SCREEN_TITLE;
    return { screen: SCREEN_TITLE };
  }
  // cover (and any unknown name): the night market mid-hunt, three found.
  game.startLevel(0);
  markFound(game, ['moon', 'lantern', 'cat']);
  state.timeLeft = 137;
  state.score = 330;
  state.combo = 3;
  state.hintsLeft = 2;
  return { screen: SCREEN_PLAY };
}
