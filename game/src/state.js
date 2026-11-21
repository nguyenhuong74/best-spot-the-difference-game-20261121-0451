// Lantern Hunt — the game state: which scene, what is found, time, score.
// Pure logic, no drawing and no DOM: the renderer reads this, input writes to it.
import {
  HINTS_PER_LEVEL,
  POINTS_PER_FIND,
  POINTS_PER_COMBO,
  POINTS_WRONG_CLICK,
  POINTS_HINT,
  TIME_PENALTY_WRONG_CLICK,
  SCREEN_TITLE,
  SCREEN_PLAY,
  SCREEN_PAUSED,
  SCREEN_LEVEL_DONE,
  SCREEN_VICTORY,
  SCREEN_TIME_UP,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREENS = {
  TITLE: SCREEN_TITLE,
  PLAY: SCREEN_PLAY,
  PAUSED: SCREEN_PAUSED,
  LEVEL_DONE: SCREEN_LEVEL_DONE,
  VICTORY: SCREEN_VICTORY,
  TIME_UP: SCREEN_TIME_UP,
};

export function createGameState(sound) {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    hintsLeft: HINTS_PER_LEVEL,
    timeLeft: SCENES[0].timeLimit,
    score: 0,
    combo: 0,
    best: 0,
    hintTarget: null, // difference id currently pulsing, or null
    hintUntil: 0,
    misses: [], // {x, y, until} red X flashes, panel-local coords
    lastTickSecond: -1,
    levelBonus: 0,
    timeUpLevel: 0,
  };

  function scene() {
    return SCENES[state.levelIndex];
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.hintsLeft = HINTS_PER_LEVEL;
    state.timeLeft = scene().timeLimit;
    state.combo = 0;
    state.hintTarget = null;
    state.misses = [];
    state.levelBonus = 0;
    state.lastTickSecond = -1;
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    startLevel(0);
  }

  /** The difference at panel-local (x, y), or null when the click missed. */
  function differenceAt(x, y) {
    for (const diff of scene().differences) {
      if (state.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
    }
    return null;
  }

  function clickAt(x, y, now, panel) {
    if (state.screen !== SCREEN_PLAY) return null;
    const diff = differenceAt(x, y);
    if (diff) {
      state.found.add(diff.id);
      state.combo += 1;
      state.score += POINTS_PER_FIND + (state.combo - 1) * POINTS_PER_COMBO;
      sound.found();
      if (state.found.size === scene().differences.length) {
        state.levelBonus = Math.round(state.timeLeft) * 2;
        state.score += state.levelBonus;
        if (state.levelIndex === SCENES.length - 1) {
          state.screen = SCREEN_VICTORY;
          if (state.score > state.best) state.best = state.score;
          sound.victory();
        } else {
          state.screen = SCREEN_LEVEL_DONE;
          sound.levelClear();
        }
      }
      return { type: 'found', diff };
    }
    state.combo = 0;
    state.score = Math.max(0, state.score + POINTS_WRONG_CLICK);
    state.timeLeft = Math.max(0, state.timeLeft - TIME_PENALTY_WRONG_CLICK);
    state.misses.push({ panel: panel ?? 'A', x, y, until: now + 700 });
    sound.wrong();
    return { type: 'miss' };
  }

  function useHint(now) {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return null;
    const remaining = scene().differences.filter((diff) => !state.found.has(diff.id));
    if (remaining.length === 0) return null;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score + POINTS_HINT);
    state.hintTarget = pick.id;
    state.hintUntil = now + 2500;
    sound.hint();
    return pick;
  }

  function nextLevel() {
    if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
  }

  function tick(dt, now) {
    if (state.screen !== SCREEN_PLAY) return;
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (whole <= 5 && whole !== state.lastTickSecond && whole > 0) {
      state.lastTickSecond = whole;
      sound.tick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.timeUpLevel = state.levelIndex;
      state.screen = SCREEN_TIME_UP;
    }
    if (state.hintTarget && now > state.hintUntil) state.hintTarget = null;
    state.misses = state.misses.filter((miss) => now < miss.until);
  }

  return {
    state,
    scene,
    startLevel,
    startGame,
    nextLevel,
    clickAt,
    useHint,
    tick,
    foundCount() {
      return state.found.size;
    },
    totalCount() {
      return scene().differences.length;
    },
  };
}
