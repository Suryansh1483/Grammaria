import { ATLAS_COASTLINES } from './atlas-coastlines';
import { WORLD_SIZE } from '@/lib/atlas-camera';

// Align to the original painted borders; keep each supplied cutout's aspect ratio.
export const ATLAS_LAYOUT: Record<string, { x: number; y: number; width: number }> = Object.fromEntries(
  Object.entries(ATLAS_COASTLINES).map(([id, { bounds: [left, top, right, bottom] }]) => [id, {
    x: (left + right) / 2 / WORLD_SIZE.width * 100,
    y: (top + bottom) / 2 / WORLD_SIZE.height * 100,
    width: right - left + 12,
  }]),
);
