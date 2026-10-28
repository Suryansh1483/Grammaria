import assert from 'node:assert/strict';
import { fitScale, clampCamera, zoomAt, WORLD_SIZE } from '../src/lib/atlas-camera.ts';

const viewport = { width: 1200, height: 700 };
const origin = { x: 0, y: 0, zoom: 1 };
const scale = fitScale(viewport);
assert.ok(WORLD_SIZE.width * scale <= viewport.width);
assert.ok(WORLD_SIZE.height * scale <= viewport.height);
assert.deepEqual(clampCamera({ x: 9999, y: -9999, zoom: .1 }, viewport), origin);
assert.equal(clampCamera({ ...origin, zoom: 99 }, viewport).zoom, 4);

const pointer = { x: 80, y: -40 };
const zoomed = zoomAt(origin, 2, pointer, viewport);
assert.equal(zoomed.x, -80, 'Pointer anchor must stay over the same map point');
assert.equal(zoomed.y, 40);
assert.deepEqual(zoomAt(zoomed, 1, pointer, viewport), origin, 'Zooming back must restore the original view');
assert.deepEqual(zoomAt(origin, 1, pointer, viewport), origin, 'Minimum zoom must not drift');

const far = clampCamera({ x: 100000, y: -100000, zoom: 4 }, viewport);
const horizontalLimit = Math.max(0, (WORLD_SIZE.width * scale * 4 - viewport.width) / 2);
assert.equal(far.x, horizontalLimit);
assert.ok(Number.isFinite(clampCamera(far, { width: 320, height: 200 }).x));
assert.ok(Number.isFinite(fitScale({ width: 0, height: 0 })), 'Hidden viewports must not create NaN transforms');
console.log('Atlas camera: fit, limits, anchored zoom, pan bounds, resize and hidden viewports passed.');
