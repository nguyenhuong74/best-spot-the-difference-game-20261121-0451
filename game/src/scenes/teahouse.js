// Lantern Hunt — Scene 3: the Mountain Teahouse. Every shape is drawn in code;
// panel B is the same drawing with seven small changes applied on top.
import { PANEL_W, PANEL_H } from '../config.js';

const WALL_WOOD = '#8a5a34';
const ROOF = '#2f5d50';
const MID_MOUNTAIN = '#5d8a6e';

function skyGradient(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, '#bfe8d8');
  g.addColorStop(1, '#e8f5e0');
  return g;
}

/** A bird: two curved wings. */
function drawBird(ctx, x, y, scale) {
  ctx.strokeStyle = '#3a4a3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 7 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 7 * scale, x + 11 * scale, y);
  ctx.stroke();
}

/** A pine tree: trunk and layered foliage clusters. */
function drawPine(ctx) {
  // trunk
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(106, 240, 12, 120);
  // foliage: three layered clusters
  ctx.fillStyle = '#2f6b3a';
  const clusters = [
    [112, 210, 52, 34],
    [112, 172, 44, 30],
    [112, 140, 34, 26],
  ];
  clusters.forEach(([cx, cy, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // trunk tip poking through the top cluster
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(109, 118, 6, 14);
}

/** The teahouse: wooden walls, curved roof, door, window and lantern. */
function drawTeahouse(ctx, lanternLit, windowLit) {
  // walls
  ctx.fillStyle = WALL_WOOD;
  ctx.fillRect(360, 210, 200, 150);
  ctx.fillStyle = '#6a4226';
  ctx.fillRect(360, 210, 200, 8);
  // door
  ctx.fillStyle = '#4a2e18';
  ctx.fillRect(430, 270, 56, 90);
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 2;
  ctx.strokeRect(434, 274, 48, 86);
  ctx.fillStyle = '#d9a441';
  ctx.beginPath();
  ctx.arc(478, 318, 4, 0, Math.PI * 2);
  ctx.fill();
  // window: dark, or warm and lit
  ctx.fillStyle = windowLit ? '#ffd166' : '#2a1a10';
  ctx.fillRect(500, 250, 40, 40);
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 2;
  ctx.strokeRect(500, 250, 40, 40);
  ctx.beginPath();
  ctx.moveTo(520, 250);
  ctx.lineTo(520, 290);
  ctx.moveTo(500, 270);
  ctx.lineTo(540, 270);
  ctx.stroke();
  // curved roof with upturned eaves
  ctx.fillStyle = ROOF;
  ctx.beginPath();
  ctx.moveTo(340, 214);
  ctx.quadraticCurveTo(460, 158, 580, 214);
  ctx.lineTo(566, 214);
  ctx.quadraticCurveTo(460, 178, 354, 214);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#24463c';
  ctx.fillRect(340, 210, 240, 6);
  // ridge
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(360, 196);
  ctx.quadraticCurveTo(460, 164, 560, 196);
  ctx.stroke();
  // hanging lantern by the door
  const lx = 516;
  const ly = 232;
  ctx.strokeStyle = '#1c1428';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx, 216);
  ctx.lineTo(lx, ly - 12);
  ctx.stroke();
  if (lanternLit) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
    ctx.beginPath();
    ctx.arc(lx, ly, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = lanternLit ? '#ff9d5c' : '#9a9a9a';
  ctx.beginPath();
  ctx.ellipse(lx, ly, 11, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(lx - 6, ly - 16, 12, 3);
  ctx.fillRect(lx - 6, ly + 13, 12, 3);
}

/** A koi fish in the pond: orange body, tail, fin. */
function drawKoi(ctx, x, y, angle, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f08a1e';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(-26, -8);
  ctx.lineTo(-26, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(10, -2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#241a10';
  ctx.beginPath();
  ctx.arc(11, -2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** The teapot on its table, with steam curls rising. */
function drawTeapot(ctx, steamCurls) {
  // table
  ctx.fillStyle = '#6a4a22';
  ctx.fillRect(372, 330, 64, 8);
  ctx.fillRect(378, 338, 6, 22);
  ctx.fillRect(424, 338, 6, 22);
  // pot body, spout, lid
  ctx.fillStyle = '#3a6ea5';
  ctx.beginPath();
  ctx.ellipse(404, 318, 20, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(420, 314);
  ctx.quadraticCurveTo(434, 306, 436, 298);
  ctx.lineTo(430, 298);
  ctx.quadraticCurveTo(426, 308, 418, 310);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2a4a6a';
  ctx.beginPath();
  ctx.ellipse(404, 306, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // steam: one or two wavy curls
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 2.5;
  const curls = steamCurls === 2 ? [396, 412] : [404];
  curls.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.bezierCurveTo(x - 6, 288, x + 6, 280, x - 2, 268);
    ctx.stroke();
  });
}

function drawBase(ctx) {
  // sky
  ctx.fillStyle = skyGradient(ctx);
  ctx.fillRect(0, 0, PANEL_W, 260);
  drawBird(ctx, 180, 70, 1);
  drawBird(ctx, 250, 50, 0.9);
  // mountains: far, mid, near
  ctx.fillStyle = '#7fa88f';
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(120, 130);
  ctx.lineTo(240, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = MID_MOUNTAIN;
  ctx.beginPath();
  ctx.moveTo(140, 260);
  ctx.lineTo(330, 100);
  ctx.lineTo(520, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3f6b52';
  ctx.beginPath();
  ctx.moveTo(380, 260);
  ctx.lineTo(520, 150);
  ctx.lineTo(620, 260);
  ctx.closePath();
  ctx.fill();
  // snow caps
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.moveTo(108, 144);
  ctx.lineTo(120, 130);
  ctx.lineTo(132, 144);
  ctx.lineTo(124, 142);
  ctx.lineTo(120, 150);
  ctx.lineTo(116, 142);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(316, 116);
  ctx.lineTo(330, 100);
  ctx.lineTo(344, 116);
  ctx.lineTo(336, 114);
  ctx.lineTo(330, 122);
  ctx.lineTo(324, 114);
  ctx.closePath();
  ctx.fill();
  // ground
  ctx.fillStyle = '#4a6b3a';
  ctx.fillRect(0, 260, PANEL_W, PANEL_H - 260);
  ctx.fillStyle = '#3d5a30';
  ctx.fillRect(0, 260, PANEL_W, 10);
  drawPine(ctx);
  drawTeahouse(ctx, true, false);
  // stone path from the bottom to the door
  ctx.fillStyle = '#c8b898';
  [[392, 448, 26], [412, 424, 24], [428, 400, 22], [442, 378, 20]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // pond with koi
  ctx.fillStyle = '#2a6a8a';
  ctx.beginPath();
  ctx.ellipse(120, 402, 92, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8ac8e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(120, 402, 92, 34, 0, 0, Math.PI * 2);
  ctx.stroke();
  drawKoi(ctx, 96, 396, 0.3, 1);
  drawKoi(ctx, 148, 412, -0.4, 0.9);
  drawTeapot(ctx, 2);
}

/** The seven changes panel B shows. Each paints over the base drawing. */
function drawChanges(ctx) {
  // 2 + 7. one redraw of the teahouse: lantern unlit, window lit warm
  drawTeahouse(ctx, false, true);
  // 1. a third koi joins the pond
  drawKoi(ctx, 122, 388, 2.6, 0.85);
  // 3. only one steam curl rises: repaint the second curl with the wall colour
  ctx.fillStyle = WALL_WOOD;
  ctx.fillRect(388, 266, 16, 36);
  // 4. a stepping stone vanishes: repaint it with the ground colour
  ctx.fillStyle = '#4a6b3a';
  ctx.beginPath();
  ctx.ellipse(412, 424, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // 5. one roof tile turns red (inside the roof band, after the teahouse redraw)
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(447, 190, 16, 6);
  // 6. a third bird appears in the sky
  drawBird(ctx, 320, 80, 0.9);
}

export const teahouseScene = {
  id: 'teahouse',
  name: 'Mountain Teahouse',
  subtitle: 'Tea, koi and quiet mountains',
  timeLimit: 120,
  differences: [
    { id: 'koi', x: 122, y: 396, r: 30, label: 'An extra koi in the pond' },
    { id: 'lantern', x: 516, y: 232, r: 26, label: 'The lantern went out' },
    { id: 'steam', x: 400, y: 284, r: 24, label: 'A steam curl vanished' },
    { id: 'stone', x: 412, y: 424, r: 26, label: 'A stepping stone vanished' },
    { id: 'tile', x: 455, y: 193, r: 24, label: 'A roof tile changed colour' },
    { id: 'bird', x: 320, y: 80, r: 24, label: 'An extra bird in the sky' },
    { id: 'window', x: 520, y: 270, r: 26, label: 'The window lit up' },
  ],
  draw(ctx, variant) {
    drawBase(ctx);
    if (variant === 'B') drawChanges(ctx);
  },
};
