// Lantern Hunt — shared constants: canvas geometry, scoring, timing.
export const PANEL_W = 620;
export const PANEL_H = 460;
export const PANEL_GAP = 40;
export const CANVAS_W = PANEL_W * 2 + PANEL_GAP;
export const CANVAS_H = PANEL_H;

export const PANEL_A_X = 0;
export const PANEL_B_X = PANEL_W + PANEL_GAP;

// Scoring
export const POINTS_PER_FIND = 100;
export const POINTS_PER_COMBO = 10;
export const POINTS_WRONG_CLICK = -10;
export const POINTS_HINT = -25;
export const TIME_PENALTY_WRONG_CLICK = 3; // seconds lost on a miss
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2500;

// Screens
export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_VICTORY = 'victory';
export const SCREEN_TIME_UP = 'time-up';

// Marker look
export const MARKER_COLOR = '#37e05a';
export const MARKER_WIDTH = 5;
export const HINT_COLOR = '#ffd166';
export const MISS_COLOR = '#ff5a5a';
