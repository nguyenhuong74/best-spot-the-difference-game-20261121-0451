// Lantern Hunt — the three scenes in play order, easiest first.
import { marketScene } from './scenes/market.js';
import { harbourScene } from './scenes/harbour.js';
import { teahouseScene } from './scenes/teahouse.js';

export const SCENES = [marketScene, harbourScene, teahouseScene];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
