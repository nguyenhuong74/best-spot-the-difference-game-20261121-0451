// Lantern Hunt — the renderer: paints both panels on the canvas (the scene
// twice, markers on top) and keeps the DOM HUD and overlay cards in sync.
import {
  PANEL_W,
  PANEL_H,
  PANEL_B_X,
  CANVAS_W,
  CANVAS_H,
  MARKER_COLOR,
  MARKER_WIDTH,
  HINT_COLOR,
  MISS_COLOR,
  SCREEN_TITLE,
  SCREEN_PLAY,
  SCREEN_PAUSED,
  SCREEN_LEVEL_DONE,
  SCREEN_VICTORY,
  SCREEN_TIME_UP,
} from './config.js';
import { SCENES } from './scenes.js';

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** A green ring plus a tick: the satisfying mark on a found difference. */
function drawFoundMarker(ctx, x, y, r) {
  ctx.strokeStyle = MARKER_COLOR;
  ctx.lineWidth = MARKER_WIDTH;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = MARKER_COLOR;
  ctx.beginPath();
  ctx.arc(x + r * 0.55, y - r * 0.55, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0e2412';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + r * 0.55 - 5, y - r * 0.55);
  ctx.lineTo(x + r * 0.55 - 1, y - r * 0.55 + 4);
  ctx.lineTo(x + r * 0.55 + 6, y - r * 0.55 - 5);
  ctx.stroke();
}

/** A pulsing gold ring around the hinted difference. */
function drawHintRing(ctx, x, y, r, now) {
  const pulse = 4 + 3 * Math.sin(now / 160);
  ctx.strokeStyle = HINT_COLOR;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 209, 102, 0.18)';
  ctx.beginPath();
  ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
  ctx.fill();
}

/** A red X that fades out where a click missed. */
function drawMiss(ctx, x, y, until, now) {
  const alpha = Math.max(0, (until - now) / 700);
  ctx.strokeStyle = MISS_COLOR;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 5;
  const s = 12;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** A small A / B tag in the panel's top-left corner. */
function drawPanelTag(ctx, x, letter) {
  ctx.fillStyle = 'rgba(10, 6, 20, 0.72)';
  ctx.beginPath();
  ctx.roundRect(x + 6, 6, 30, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, x + 21, 20);
}

export function createRenderer(canvas, el) {
  const ctx = canvas.getContext('2d');

  function drawPanels(game, now) {
    const { state } = game;
    const scene = SCENES[state.levelIndex];
    ctx.fillStyle = '#17102a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // panel A (the original) and panel B (with the changes)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PANEL_W, PANEL_H);
    ctx.clip();
    scene.draw(ctx, 'A');
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(PANEL_B_X, 0, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(PANEL_B_X, 0);
    scene.draw(ctx, 'B');
    ctx.restore();
    // frames and tags
    ctx.strokeStyle = '#4a3a68';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, PANEL_W - 2, PANEL_H - 2);
    ctx.strokeRect(PANEL_B_X + 1, 1, PANEL_W - 2, PANEL_H - 2);
    drawPanelTag(ctx, 0, 'A');
    drawPanelTag(ctx, PANEL_B_X, 'B');
    // found markers on both panels
    for (const diff of scene.differences) {
      if (!state.found.has(diff.id)) continue;
      drawFoundMarker(ctx, diff.x, diff.y, diff.r);
      drawFoundMarker(ctx, PANEL_B_X + diff.x, diff.y, diff.r);
    }
    // hint pulse on both panels
    if (state.hintTarget) {
      const diff = scene.differences.find((item) => item.id === state.hintTarget);
      if (diff) {
        drawHintRing(ctx, diff.x, diff.y, diff.r, now);
        drawHintRing(ctx, PANEL_B_X + diff.x, diff.y, diff.r, now);
      }
    }
    // miss flashes on the panel that was clicked
    for (const miss of state.misses) {
      const baseX = miss.panel === 'B' ? PANEL_B_X : 0;
      drawMiss(ctx, baseX + miss.x, miss.y, miss.until, now);
    }
  }

  function syncHud(game) {
    const { state } = game;
    const scene = SCENES[state.levelIndex];
    el.levelName.textContent = `${scene.name} · Level ${state.levelIndex + 1} of ${SCENES.length}`;
    el.foundCounter.textContent = `Found ${state.found.size} / ${scene.differences.length}`;
    el.timer.textContent = formatTime(state.timeLeft);
    el.timer.classList.toggle('low', state.screen === SCREEN_PLAY && state.timeLeft <= 30);
    el.score.textContent = `Score ${state.score}`;
    el.hintBtn.textContent = `Hint (${state.hintsLeft})`;
    el.hintBtn.disabled = state.screen !== SCREEN_PLAY || state.hintsLeft <= 0;
    el.pauseBtn.textContent = state.screen === SCREEN_PAUSED ? 'Resume' : 'Pause';
    el.pauseBtn.disabled = state.screen !== SCREEN_PLAY && state.screen !== SCREEN_PAUSED;
  }

  function announce(message) {
    el.status.textContent = message;
  }

  /** Show an overlay card; hide it with hideOverlay(). */
  function showOverlay(config) {
    el.overlayTitle.textContent = config.title;
    el.overlayText.innerHTML = config.text;
    el.overlayFoot.textContent = config.foot ?? '';
    el.overlayPrimary.textContent = config.primaryLabel;
    el.overlayPrimary.onclick = config.onPrimary;
    if (config.secondaryLabel) {
      el.overlaySecondary.classList.remove('hidden');
      el.overlaySecondary.textContent = config.secondaryLabel;
      el.overlaySecondary.onclick = config.onSecondary;
    } else {
      el.overlaySecondary.classList.add('hidden');
    }
    if (config.levels) {
      el.overlayLevels.classList.remove('hidden');
      el.overlayLevels.innerHTML = '';
      SCENES.forEach((scene, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${index + 1}. ${scene.name} (${scene.differences.length} to find)`;
        button.addEventListener('click', () => config.levels(index));
        el.overlayLevels.appendChild(button);
      });
    } else {
      el.overlayLevels.classList.add('hidden');
    }
    el.overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    el.overlay.classList.add('hidden');
  }

  /** The overlay for the current screen; call after every screen change. */
  function syncOverlay(game, actions) {
    const { state } = game;
    const scene = SCENES[state.levelIndex];
    if (state.screen === SCREEN_TITLE) {
      showOverlay({
        title: 'Lantern Hunt',
        text: 'Two pictures, seven differences. Find them all before the lanterns burn down.<br>Click a difference on <b>either</b> picture — it counts on both. Wrong clicks cost points and time.',
        foot: 'Three scenes · 21 differences · hints are limited, use them well.',
        primaryLabel: 'Start the hunt',
        onPrimary: actions.start,
        secondaryLabel: 'How to play',
        onSecondary: () => {
          el.overlayText.innerHTML = 'Click the spot that differs between the two pictures. '
            + 'A green ring marks each find. <b>H</b> spends a hint, <b>P</b> pauses, '
            + '<b>1–3</b> picks a scene from the title. Finish a scene to unlock the next — '
            + 'and mind the timer: leftover seconds turn into bonus points.';
        },
        levels: actions.pickLevel,
      });
    } else if (state.screen === SCREEN_LEVEL_DONE) {
      showOverlay({
        title: `${scene.name} — cleared!`,
        text: `All ${scene.differences.length} differences found.<br>Time bonus: <b>+${state.levelBonus}</b> points &nbsp;·&nbsp; Score so far: <b>${state.score}</b>`,
        foot: 'The next scene hides its differences better.',
        primaryLabel: 'Next scene',
        onPrimary: actions.nextLevel,
      });
    } else if (state.screen === SCREEN_VICTORY) {
      showOverlay({
        title: 'You found them all!',
        text: `Every difference in all three scenes — <b>21 of 21</b>.<br>Final score: <b>${state.score}</b>${state.score >= state.best ? ' — a new best!' : ''}`,
        foot: 'Play again to beat your score, or pick a scene to hunt again.',
        primaryLabel: 'Play again',
        onPrimary: actions.start,
        secondaryLabel: 'Pick a scene',
        onSecondary: actions.toTitle,
        levels: actions.pickLevel,
      });
    } else if (state.screen === SCREEN_TIME_UP) {
      showOverlay({
        title: 'Time ran out',
        text: `The lanterns burned down with <b>${scene.differences.length - state.found.size}</b> difference${scene.differences.length - state.found.size === 1 ? '' : 's'} still hiding in <b>${scene.name}</b>.`,
        foot: 'Your score is kept — try the scene again.',
        primaryLabel: 'Retry this scene',
        onPrimary: actions.retryLevel,
        secondaryLabel: 'Back to title',
        onSecondary: actions.toTitle,
      });
    } else if (state.screen === SCREEN_PAUSED) {
      showOverlay({
        title: 'Paused',
        text: `Take a breath. <b>${scene.differences.length - state.found.size}</b> difference${scene.differences.length - state.found.size === 1 ? '' : 's'} still hiding.`,
        foot: '',
        primaryLabel: 'Resume',
        onPrimary: actions.resume,
      });
    } else {
      hideOverlay();
    }
  }

  return {
    draw(state, now) {
      drawPanels(state, now);
      syncHud(state);
    },
    syncOverlay,
    announce,
    hideOverlay,
  };
}
