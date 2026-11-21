// Lantern Hunt — Scene 2: the Harbour at Dawn. Every shape is drawn in code;
// panel B is the same drawing with seven small changes applied on top.
import { PANEL_W, PANEL_H } from '../config.js';

const SEA_TOP = '#2e6f8e';
const SEA_BOTTOM = '#1d4a63';
const PIER_WOOD = '#8a6a3a';

function skyGradient(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, '#ffe3ae');
  g.addColorStop(0.6, '#ffb98a');
  g.addColorStop(1, '#ff9d76');
  return g;
}

function seaGradient(ctx) {
  const g = ctx.createLinearGradient(0, 300, 0, PANEL_H);
  g.addColorStop(0, SEA_TOP);
  g.addColorStop(1, SEA_BOTTOM);
  return g;
}

/** A soft puffy cloud. */
function drawCloud(ctx, x, y, scale) {
  ctx.fillStyle = 'rgba(255, 244, 224, 0.92)';
  [[0, 0, 26], [24, -10, 30], [50, 0, 24], [24, 6, 28]].forEach(([dx, dy, r]) => {
    ctx.beginPath();
    ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** A gull: two curved wings. */
function drawGull(ctx, x, y, scale) {
  ctx.strokeStyle = '#4a3a3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12 * scale, y);
  ctx.quadraticCurveTo(x - 5 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 5 * scale, y - 8 * scale, x + 12 * scale, y);
  ctx.stroke();
}

/** The lighthouse: white tower, red bands, lamp room on top. */
function drawLighthouse(ctx, lampColour) {
  // tower
  ctx.fillStyle = '#f5efe0';
  ctx.beginPath();
  ctx.moveTo(64, 340);
  ctx.lineTo(76, 128);
  ctx.lineTo(116, 128);
  ctx.lineTo(128, 340);
  ctx.closePath();
  ctx.fill();
  // red bands
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(70, 196, 52, 26);
  ctx.fillRect(67, 272, 58, 26);
  // gallery and lamp room
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(68, 112, 56, 10);
  ctx.fillRect(74, 88, 44, 24);
  ctx.fillStyle = lampColour;
  ctx.fillRect(80, 93, 32, 14);
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.moveTo(70, 88);
  ctx.lineTo(96, 70);
  ctx.lineTo(122, 88);
  ctx.closePath();
  ctx.fill();
}

/** A sailing boat: hull, mast and one triangular sail. */
function drawBoat(ctx, x, y, scale, sailColour, withFlag, flagColour) {
  // hull
  ctx.fillStyle = '#6a4a22';
  ctx.beginPath();
  ctx.moveTo(x - 52 * scale, y);
  ctx.lineTo(x + 52 * scale, y);
  ctx.lineTo(x + 38 * scale, y + 18 * scale);
  ctx.lineTo(x - 38 * scale, y + 18 * scale);
  ctx.closePath();
  ctx.fill();
  // mast
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 78 * scale);
  ctx.stroke();
  // sail
  ctx.fillStyle = sailColour;
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 74 * scale);
  ctx.lineTo(x + 4, y - 8 * scale);
  ctx.lineTo(x + 46 * scale, y - 8 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 70 * scale);
  ctx.lineTo(x - 4, y - 8 * scale);
  ctx.lineTo(x - 34 * scale, y - 8 * scale);
  ctx.closePath();
  ctx.fill();
  if (withFlag) {
    ctx.fillStyle = flagColour;
    ctx.beginPath();
    ctx.moveTo(x, y - 78 * scale);
    ctx.lineTo(x + 22 * scale, y - 72 * scale);
    ctx.lineTo(x, y - 66 * scale);
    ctx.closePath();
    ctx.fill();
  }
}

/** A striped buoy bobbing in the water. */
function drawBuoy(ctx, stripeColour) {
  ctx.fillStyle = '#f5efe0';
  ctx.beginPath();
  ctx.moveTo(404, 402);
  ctx.lineTo(412, 372);
  ctx.lineTo(428, 372);
  ctx.lineTo(436, 402);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = stripeColour;
  ctx.fillRect(408, 384, 24, 8);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(417, 362, 6, 10);
  // reflection
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(404, 410);
  ctx.lineTo(436, 410);
  ctx.stroke();
}

/** The fisherman on the pier, rod bent over the water. */
function drawFisherman(ctx) {
  // legs and body
  ctx.strokeStyle = '#2a4a6a';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(200, 296);
  ctx.lineTo(196, 330);
  ctx.moveTo(200, 296);
  ctx.lineTo(206, 330);
  ctx.stroke();
  ctx.fillStyle = '#e8a34a';
  ctx.fillRect(188, 258, 26, 42);
  // head and hat
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(201, 246, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a4a6a';
  ctx.beginPath();
  ctx.ellipse(201, 238, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // rod
  ctx.strokeStyle = '#5a4220';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(212, 268);
  ctx.quadraticCurveTo(250, 240, 268, 252);
  ctx.stroke();
  ctx.strokeStyle = '#d9c8a0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(268, 252);
  ctx.lineTo(268, 300);
  ctx.stroke();
}

/** The bucket beside the fisherman, with fish tails sticking out. */
function drawBucket(ctx, fishCount) {
  ctx.fillStyle = '#7a7a7a';
  ctx.beginPath();
  ctx.moveTo(244, 330);
  ctx.lineTo(268, 330);
  ctx.lineTo(264, 356);
  ctx.lineTo(248, 356);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(242, 328, 28, 4);
  const tails = [[250, 326], [260, 324], [255, 320]];
  for (let i = 0; i < fishCount; i += 1) {
    const [x, y] = tails[i];
    ctx.fillStyle = '#c8c8c8';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y - 8);
    ctx.lineTo(x + 8, y + 2);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBase(ctx) {
  const sky = skyGradient(ctx);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = seaGradient(ctx);
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);
  // sun with rays
  ctx.fillStyle = '#ffdf6b';
  ctx.beginPath();
  ctx.arc(520, 78, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffdf6b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(520 + Math.cos(a) * 42, 78 + Math.sin(a) * 42);
    ctx.lineTo(520 + Math.cos(a) * 54, 78 + Math.sin(a) * 54);
    ctx.stroke();
  }
  drawCloud(ctx, 120, 60, 1);
  drawCloud(ctx, 300, 40, 0.8);
  drawCloud(ctx, 430, 130, 0.7);
  drawGull(ctx, 200, 90, 1);
  drawGull(ctx, 260, 60, 0.8);
  drawGull(ctx, 330, 110, 1);
  // distant headland
  ctx.fillStyle = '#8a6a8a';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(120, 240, 260, 300);
  ctx.closePath();
  ctx.fill();
  drawLighthouse(ctx, '#ffd166');
  // pier
  ctx.fillStyle = PIER_WOOD;
  ctx.fillRect(0, 330, PANEL_W, 16);
  ctx.fillStyle = '#6a4a22';
  [60, 180, 300, 420, 540].forEach((x) => ctx.fillRect(x, 346, 10, 30));
  // boats
  drawBoat(ctx, 300, 322, 1, '#c0392b', false, '#3a6ea5');
  drawBoat(ctx, 470, 348, 0.7, '#3a6ea5', true, '#3a6ea5');
  drawFisherman(ctx);
  drawBucket(ctx, 2);
  drawBuoy(ctx, '#c0392b');
  // crates on the pier
  ctx.fillStyle = '#8a6a3a';
  ctx.fillRect(540, 300, 30, 30);
  ctx.fillRect(572, 312, 22, 18);
  ctx.strokeStyle = '#5a4220';
  ctx.lineWidth = 2;
  ctx.strokeRect(540, 300, 30, 30);
  ctx.strokeRect(572, 312, 22, 18);
  // waves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  [[80, 380], [180, 420], [330, 400], [520, 430], [250, 440]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 12, y - 6, x + 24, y);
    ctx.quadraticCurveTo(x + 36, y + 6, x + 48, y);
    ctx.stroke();
  });
}

/** The seven changes panel B shows. Each paints over the base drawing. */
function drawChanges(ctx) {
  // 1. the sun turns orange (same disc and rays, warmer colour)
  ctx.fillStyle = '#ff9d5c';
  ctx.beginPath();
  ctx.arc(520, 78, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff9d5c';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(520 + Math.cos(a) * 42, 78 + Math.sin(a) * 42);
    ctx.lineTo(520 + Math.cos(a) * 54, 78 + Math.sin(a) * 54);
    ctx.stroke();
  }
  // 2. the third gull is gone: repaint it with the sky gradient itself
  ctx.fillStyle = skyGradient(ctx);
  ctx.fillRect(312, 96, 38, 20);
  // 3. the lighthouse lamp goes dark
  drawLighthouse(ctx, '#5a5a5a');
  // 4. the big boat's sail turns green (same shape, new colour)
  drawBoat(ctx, 300, 322, 1, '#2a8a5a', false, '#3a6ea5');
  // 5. the buoy's stripe turns blue
  drawBuoy(ctx, '#3a6ea5');
  // 6. a third fish appears in the bucket
  drawBucket(ctx, 3);
  // 7. the small boat's flag turns yellow
  drawBoat(ctx, 470, 348, 0.7, '#3a6ea5', true, '#ffd166');
}

export const harbourScene = {
  id: 'harbour',
  name: 'Harbour at Dawn',
  subtitle: 'Boats, gulls and a lighthouse waking up',
  timeLimit: 150,
  differences: [
    { id: 'sun', x: 520, y: 78, r: 38, label: 'The sun changed colour' },
    { id: 'gull', x: 330, y: 110, r: 24, label: 'A gull vanished' },
    { id: 'lamp', x: 96, y: 100, r: 20, label: 'The lighthouse lamp went dark' },
    { id: 'sail', x: 322, y: 268, r: 32, label: 'A sail changed colour' },
    { id: 'buoy', x: 420, y: 386, r: 28, label: 'The buoy stripe changed' },
    { id: 'fish', x: 256, y: 330, r: 26, label: 'An extra fish in the bucket' },
    { id: 'flag', x: 486, y: 296, r: 24, label: 'The flag changed colour' },
  ],
  draw(ctx, variant) {
    drawBase(ctx);
    if (variant === 'B') drawChanges(ctx);
  },
};
