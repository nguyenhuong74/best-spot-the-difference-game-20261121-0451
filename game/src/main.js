// Lantern Hunt — boot and the one loop: input is read every frame, the timer
// advances while playing, and the renderer paints what is there.
//
// ?shot=cover|harbour|victory|start stages that scene instead of running the
// loop, paints it twice and sets window.__shotReady for a screenshot.
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVEL_DONE, SCREEN_VICTORY, SCREEN_TIME_UP } from './config.js';
import { createSoundBank } from './audio.js';
import { createGameState } from './state.js';
import { createInput, ACTION_CONFIRM, ACTION_PAUSE, ACTION_HINT, pauseTarget } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const BEST_KEY = 'lantern-hunt-best';
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const el = {
  levelName: document.getElementById('level-name'),
  foundCounter: document.getElementById('found-counter'),
  timer: document.getElementById('timer'),
  score: document.getElementById('score'),
  hintBtn: document.getElementById('hint-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  soundBtn: document.getElementById('sound-btn'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayText: document.getElementById('overlay-text'),
  overlayLevels: document.getElementById('overlay-levels'),
  overlayPrimary: document.getElementById('overlay-primary'),
  overlaySecondary: document.getElementById('overlay-secondary'),
  overlayFoot: document.getElementById('overlay-foot'),
  status: document.getElementById('status'),
};

const sound = createSoundBank();
const game = createGameState(sound);
const renderer = createRenderer(canvas, el);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

game.state.best = readBest();

function refreshOverlay() {
  renderer.syncOverlay(game, {
    start: () => {
      sound.unlock();
      game.startGame();
      renderer.announce('Playing. Find 7 differences.');
      refreshOverlay();
    },
    nextLevel: () => {
      game.nextLevel();
      renderer.announce(`Playing. ${game.scene().name}.`);
      refreshOverlay();
    },
    retryLevel: () => {
      game.startLevel(game.state.timeUpLevel);
      refreshOverlay();
    },
    toTitle: () => {
      game.state.screen = SCREEN_TITLE;
      refreshOverlay();
    },
    resume: () => {
      game.state.screen = SCREEN_PLAY;
      refreshOverlay();
    },
    pickLevel: (index) => {
      sound.unlock();
      game.state.score = 0;
      game.startLevel(index);
      refreshOverlay();
    },
  });
}

function runShot(name) {
  const staged = stageShot(name, game);
  game.state.screen = staged.screen;
  refreshOverlay();
  let painted = 0;
  function paint() {
    renderer.draw(game, performance.now());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, {
    onPanelClick(panel, x, y) {
      sound.unlock();
      const result = game.clickAt(x, y, performance.now(), panel);
      if (result?.type === 'found') {
        renderer.announce(`Found ${result.diff.label}. ${game.foundCount()} of ${game.totalCount()}.`);
        if (game.state.screen === SCREEN_LEVEL_DONE || game.state.screen === SCREEN_VICTORY) {
          if (game.state.score > game.state.best) {
            game.state.best = game.state.score;
            saveBest(game.state.best);
          }
          refreshOverlay();
        }
      } else if (result?.type === 'miss') {
        renderer.announce('Not a difference. Ten points and three seconds lost.');
      }
    },
    onCanvasClick() {
      // A click in the gap between the panels does nothing.
    },
  });

  el.hintBtn.addEventListener('click', () => {
    sound.unlock();
    const pick = game.useHint(performance.now());
    if (pick) renderer.announce(`Hint: look near the ${pick.label.toLowerCase()}.`);
  });
  el.pauseBtn.addEventListener('click', () => {
    game.state.screen = pauseTarget(game.state.screen);
    refreshOverlay();
  });
  el.soundBtn.addEventListener('click', () => {
    sound.setEnabled(!sound.enabled);
    el.soundBtn.textContent = sound.enabled ? 'Sound: on' : 'Sound: off';
  });

  let last = performance.now();
  let lastScreen = game.state.screen;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM) {
      const screen = game.state.screen;
      if (screen === SCREEN_TITLE) {
        sound.unlock();
        game.startGame();
        refreshOverlay();
      } else if (screen === SCREEN_LEVEL_DONE) {
        game.nextLevel();
        refreshOverlay();
      } else if (screen === SCREEN_VICTORY || screen === SCREEN_TIME_UP) {
        game.state.screen = SCREEN_TITLE;
        refreshOverlay();
      } else if (screen === SCREEN_PAUSED) {
        game.state.screen = SCREEN_PLAY;
        refreshOverlay();
      }
    }
    if (actions & ACTION_PAUSE) {
      game.state.screen = pauseTarget(game.state.screen);
      refreshOverlay();
    }
    if (actions & ACTION_HINT) {
      const pick = game.useHint(now);
      if (pick) renderer.announce(`Hint: look near the ${pick.label.toLowerCase()}.`);
    }
    const levelKey = input.takeLevelKey();
    if (levelKey >= 0 && game.state.screen === SCREEN_TITLE) {
      sound.unlock();
      game.state.score = 0;
      game.startLevel(levelKey);
      refreshOverlay();
    }
    game.tick(dt, now);
    if (game.state.screen !== lastScreen) {
      lastScreen = game.state.screen;
      if (game.state.screen === SCREEN_TIME_UP) refreshOverlay();
    }
    renderer.draw(game, now);
  }

  // Leaving the tab pauses a running game rather than letting the timer run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state.screen === SCREEN_PLAY) {
      game.state.screen = SCREEN_PAUSED;
      refreshOverlay();
    }
  });

  refreshOverlay();
  renderer.announce('Lantern Hunt. Press Enter or click Start to play.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
