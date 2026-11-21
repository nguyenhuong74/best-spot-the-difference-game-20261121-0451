// Lantern Hunt — Scene 1: the Night Market. Every shape is drawn in code;
// panel B is the same drawing with seven small changes applied on top.
import { PANEL_W, PANEL_H } from '../config.js';

const SKY_TOP = '#241640';
const SKY_BOTTOM = '#6e2f5e';
const GROUND = '#2e2018';
const WALL = '#3d2a1a';

function skyGradient(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, SKY_TOP);
  g.addColorStop(1, SKY_BOTTOM);
  return g;
}

/** A paper lantern: round body, gold caps, tassel. */
function drawLantern(ctx, x, y, body) {
  ctx.fillStyle = '#8a6a2a';
  ctx.fillRect(x - 2, y - 30, 4, 6); // string
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(x - 8, y - 24, 16, 5); // top cap
  ctx.fillRect(x - 8, y + 19, 16, 5); // bottom cap
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 17, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(90, 20, 20, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, 17, 22, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 14);
  ctx.quadraticCurveTo(x, y - 4, x + 10, y - 14);
  ctx.moveTo(x - 10, y + 14);
  ctx.quadraticCurveTo(x, y + 4, x + 10, y + 14);
  ctx.stroke();
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(x - 1, y + 24, 2, 10); // tassel
}

/** The vendor: head, straw hat with a band, shoulders and blue apron. */
function drawVendor(ctx, hatBand) {
  // shoulders / apron
  ctx.fillStyle = '#3a6ea5';
  ctx.beginPath();
  ctx.moveTo(118, 300);
  ctx.quadraticCurveTo(118, 238, 150, 232);
  ctx.quadraticCurveTo(182, 238, 182, 300);
  ctx.closePath();
  ctx.fill();
  // head
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(150, 212, 21, 0, Math.PI * 2);
  ctx.fill();
  // eyes and smile
  ctx.fillStyle = '#241a10';
  ctx.beginPath();
  ctx.arc(142, 210, 2.5, 0, Math.PI * 2);
  ctx.arc(158, 210, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#241a10';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(150, 218, 6, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // straw hat: wide brim and dome, with a coloured band
  ctx.fillStyle = '#d9b96a';
  ctx.beginPath();
  ctx.ellipse(150, 196, 34, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 194, 16, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = hatBand;
  ctx.fillRect(134, 190, 32, 6);
}

/** The food stall's striped awning. */
function drawAwning(ctx, stripeTwo) {
  const colours = ['#c0392b', stripeTwo, '#c0392b', '#f5e6c8', '#c0392b', '#f5e6c8'];
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = colours[i];
    ctx.fillRect(30 + i * 40, 150, 40, 34);
  }
  ctx.fillStyle = '#8a2a20';
  ctx.fillRect(30, 184, 240, 5);
  // scalloped edge
  ctx.fillStyle = '#c0392b';
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.arc(50 + i * 40, 189, 12, 0, Math.PI);
    ctx.fill();
  }
}

/** Three oranges in a basket on the counter. */
function drawOranges(ctx, count) {
  ctx.fillStyle = '#6a4a22';
  ctx.beginPath();
  ctx.ellipse(120, 296, 34, 10, 0, 0, Math.PI);
  ctx.fill();
  const spots = [[102, 284], [122, 280], [140, 285], [112, 272]];
  for (let i = 0; i < count; i += 1) {
    const [x, y] = spots[i];
    ctx.fillStyle = '#f08a1e';
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3f7a2a';
    ctx.fillRect(x - 1, y - 14, 3, 5);
  }
}

/** The toy stall's sign board with a symbol in the middle. */
function drawSign(ctx, symbol) {
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(452, 138, 96, 48);
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 3;
  ctx.strokeRect(456, 142, 88, 40);
  ctx.fillStyle = '#ffd166';
  if (symbol === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? 14 : 6;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = 500 + r * Math.cos(a);
      const y = 162 + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(500, 162, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a5230';
    ctx.beginPath();
    ctx.arc(506, 158, 11, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** The cat dozing on a crate by the toy stall. */
function drawCat(ctx) {
  // crate
  ctx.fillStyle = '#8a6a3a';
  ctx.fillRect(468, 372, 76, 48);
  ctx.strokeStyle = '#5a4220';
  ctx.lineWidth = 2;
  ctx.strokeRect(468, 372, 76, 48);
  ctx.beginPath();
  ctx.moveTo(468, 372);
  ctx.lineTo(544, 420);
  ctx.moveTo(544, 372);
  ctx.lineTo(468, 420);
  ctx.stroke();
  // sitting cat: body, head, ears, tail
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.ellipse(506, 356, 20, 17, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(506, 338, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(496, 330);
  ctx.lineTo(498, 318);
  ctx.lineTo(506, 328);
  ctx.moveTo(516, 330);
  ctx.lineTo(514, 318);
  ctx.lineTo(506, 328);
  ctx.fill();
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(524, 368);
  ctx.quadraticCurveTo(542, 366, 538, 350);
  ctx.stroke();
  // closed eye
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(502, 338, 3, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

function drawBase(ctx) {
  // sky and ground
  ctx.fillStyle = skyGradient(ctx);
  ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = GROUND;
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);
  // stars
  ctx.fillStyle = '#ffe9a8';
  [[40, 40], [200, 30], [330, 44], [470, 28], [580, 60], [260, 70], [540, 90]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  // crescent moon
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(88, 66, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = SKY_TOP;
  ctx.beginPath();
  ctx.arc(100, 58, 26, 0, Math.PI * 2);
  ctx.fill();
  // string lights across the top
  ctx.strokeStyle = '#1c1428';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.quadraticCurveTo(310, 58, 620, 18);
  ctx.stroke();
  const bulbColours = ['#ffd166', '#ff8a7a', '#8dff9e', '#7ac8ff'];
  for (let i = 0; i < 13; i += 1) {
    const x = 20 + i * 48;
    const y = 18 + Math.sin((x / 620) * Math.PI) * 34 + 6;
    ctx.fillStyle = bulbColours[i % 4];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // lantern row
  [110, 200, 290, 380, 470, 550].forEach((x) => drawLantern(ctx, x, 118, '#d94040'));
  // left stall: back wall, awning, then the vendor in front of it
  ctx.fillStyle = WALL;
  ctx.fillRect(30, 190, 240, 110);
  drawAwning(ctx, '#f5e6c8');
  drawVendor(ctx, '#c0392b');
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(30, 300, 240, 26);
  ctx.fillStyle = '#5a3a1e';
  ctx.fillRect(30, 326, 240, 8);
  drawOranges(ctx, 3);
  // vegetable basket on the ground
  ctx.fillStyle = '#6a4a22';
  ctx.beginPath();
  ctx.ellipse(70, 412, 34, 14, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#5da83a';
  [[52, 400], [70, 394], [88, 400]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  // right stall: back wall, shelf of toys, sign
  ctx.fillStyle = WALL;
  ctx.fillRect(360, 150, 230, 180);
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(360, 330, 230, 10);
  // hanging paper fans
  ['#ff8a7a', '#8dff9e', '#7ac8ff', '#ffd166'].forEach((colour, i) => {
    const x = 392 + i * 48;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, 226, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.arc(x, 226, 16, 0, Math.PI);
    ctx.fill();
  });
  // shelf toys: spinning pinwheels
  ['#ff8a7a', '#7ac8ff'].forEach((colour, i) => {
    const x = 410 + i * 120;
    ctx.strokeStyle = '#d9c8a0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.lineTo(x, 330);
    ctx.stroke();
    ctx.fillStyle = colour;
    for (let k = 0; k < 4; k += 1) {
      ctx.save();
      ctx.translate(x, 288);
      ctx.rotate((k * Math.PI) / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14, -4);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });
  drawSign(ctx, 'star');
  drawCat(ctx);
  // cobbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.ellipse(180 + i * 38, 440, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** The seven changes panel B shows. Each paints over the base drawing. */
function drawChanges(ctx) {
  // 1. moon: full instead of crescent (the full disc covers the crescent exactly)
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(88, 66, 30, 0, Math.PI * 2);
  ctx.fill();
  // 2. lantern at x=380 turns teal
  drawLantern(ctx, 380, 118, '#2a9d8f');
  // 3. second awning stripe turns red
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(70, 150, 40, 34);
  // 4. the cat is gone: repaint the wall above y=330 and the ground below it,
  // then the crate's top edge (the cat sat across both backgrounds)
  ctx.fillStyle = WALL;
  ctx.fillRect(464, 318, 84, 12);
  ctx.fillStyle = GROUND;
  ctx.fillRect(464, 330, 84, 42);
  ctx.fillStyle = '#8a6a3a';
  ctx.fillRect(468, 372, 76, 4);
  // 7. the vendor's hat band turns blue (vendor is drawn last, so this is safe)
  drawVendor(ctx, '#3a6ea5');
  // 5. a fourth orange appears in the basket
  ctx.fillStyle = '#f08a1e';
  ctx.beginPath();
  ctx.arc(112, 272, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3f7a2a';
  ctx.fillRect(111, 258, 3, 5);
  // 6. the sign shows a crescent moon instead of a star
  drawSign(ctx, 'moon');
}

export const marketScene = {
  id: 'market',
  name: 'Night Market',
  subtitle: 'Lanterns, stalls and one sleepy cat',
  timeLimit: 180,
  differences: [
    { id: 'moon', x: 88, y: 66, r: 34, label: 'The moon is full' },
    { id: 'lantern', x: 380, y: 118, r: 28, label: 'A lantern changed colour' },
    { id: 'awning', x: 90, y: 167, r: 30, label: 'An awning stripe changed' },
    { id: 'cat', x: 506, y: 352, r: 32, label: 'The cat vanished' },
    { id: 'oranges', x: 120, y: 282, r: 30, label: 'An extra orange' },
    { id: 'sign', x: 500, y: 162, r: 30, label: 'The sign changed' },
    { id: 'hat', x: 150, y: 194, r: 30, label: 'The hat band changed' },
  ],
  draw(ctx, variant) {
    drawBase(ctx);
    if (variant === 'B') drawChanges(ctx);
  },
};
