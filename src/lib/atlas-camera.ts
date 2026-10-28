export const WORLD_SIZE = { width: 1727, height: 911 };
export type Viewport = { width: number; height: number };
export type Camera = { x: number; y: number; zoom: number };

export function fitScale(viewport: Viewport) {
  return Math.max(.01, Math.min(
    Math.max(1, viewport.width - 48) / WORLD_SIZE.width,
    Math.max(1, viewport.height - 40) / WORLD_SIZE.height,
  ));
}

export function clampCamera(camera: Camera, viewport: Viewport): Camera {
  const zoom = Math.min(4, Math.max(1, camera.zoom));
  const scale = fitScale(viewport) * zoom;
  const maxX = Math.max(0, (WORLD_SIZE.width * scale - viewport.width) / 2);
  const maxY = Math.max(0, (WORLD_SIZE.height * scale - viewport.height) / 2);
  return {
    zoom,
    x: maxX ? Math.max(-maxX, Math.min(maxX, camera.x)) : 0,
    y: maxY ? Math.max(-maxY, Math.min(maxY, camera.y)) : 0,
  };
}

export function zoomAt(camera: Camera, zoom: number, point: { x: number; y: number }, viewport: Viewport) {
  const nextZoom = Math.min(4, Math.max(1, zoom));
  const ratio = nextZoom / camera.zoom;
  return clampCamera({
    zoom: nextZoom,
    x: point.x - (point.x - camera.x) * ratio,
    y: point.y - (point.y - camera.y) * ratio,
  }, viewport);
}
