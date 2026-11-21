// Lantern Hunt — keyboard and mouse input: turns clicks into panel-local
// coordinates and keys into actions. Knows nothing about drawing.
import { PANEL_W, PANEL_H, PANEL_B_X, SCREEN_PLAY, SCREEN_PAUSED } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;

/** Map a canvas click to a panel ('A' | 'B') and panel-local coords, or null. */
export function canvasClickToPanel(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  if (y < 0 || y >= PANEL_H) return null;
  if (x >= 0 && x < PANEL_W) return { panel: 'A', x, y };
  if (x >= PANEL_B_X && x < PANEL_B_X + PANEL_W) return { panel: 'B', x: x - PANEL_B_X, y };
  return null;
}

export function createInput(canvas, hooks) {
  let actions = 0;
  let levelKey = -1;

  function onPointerDown(event) {
    const hit = canvasClickToPanel(canvas, event.clientX, event.clientY);
    if (hit) hooks.onPanelClick(hit.panel, hit.x, hit.y);
    else hooks.onCanvasClick();
  }

  function onKeyDown(event) {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      actions |= ACTION_CONFIRM;
      event.preventDefault();
    } else if (key === 'p' || key === 'escape') {
      actions |= ACTION_PAUSE;
    } else if (key === 'h') {
      actions |= ACTION_HINT;
    } else if (key >= '1' && key <= '3') {
      levelKey = Number(key) - 1;
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    takeLevelKey() {
      const taken = levelKey;
      levelKey = -1;
      return taken;
    },
    destroy() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}

/** Which screen a pause key moves to, from the current screen. */
export function pauseTarget(screen) {
  if (screen === SCREEN_PLAY) return SCREEN_PAUSED;
  if (screen === SCREEN_PAUSED) return SCREEN_PLAY;
  return screen;
}
