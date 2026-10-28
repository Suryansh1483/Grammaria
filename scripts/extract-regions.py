"""Extract the supplied atlas sheet without repainting its artwork.

Run with Pillow and NumPy: python scripts/extract-regions.py artwork/region-sheet.png
"""
import json
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SEEDS = {
    "temporalia": (250, 90), "artikel": (620, 100),
    "concordia": (1000, 100), "tagtown": (1420, 120),
    "position-point": (210, 350), "centralia": (630, 330),
    "voicelands": (1040, 340), "mayhaven": (1410, 330),
    "substitia": (160, 540), "namesworth": (530, 540),
    "junctionia": (980, 550), "ifshire": (1350, 550),
    "passaggia": (180, 720), "mannerton": (560, 720),
    "lexicon-city": (980, 750), "quotehaven": (1370, 740),
    "sequentia": (380, 910), "descriptia": (780, 900),
}


def simplify(points, tolerance=1.4):
    if len(points) <= 2:
        return points
    start, end = np.array(points[0]), np.array(points[-1])
    vector = end - start
    length = np.linalg.norm(vector)
    offsets = np.array(points) - start
    distances = (np.abs(vector[0] * offsets[:, 1] - vector[1] * offsets[:, 0]) / length
                 if length else np.linalg.norm(offsets, axis=1))
    index = int(np.argmax(distances))
    if distances[index] <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


def outline(mask):
    edges = {}
    height, width = mask.shape
    for y, x in zip(*np.where(mask)):
        x, y = int(x), int(y)
        if y == 0 or not mask[y - 1, x]: edges[(x, y)] = (x + 1, y)
        if x == width - 1 or not mask[y, x + 1]: edges[(x + 1, y)] = (x + 1, y + 1)
        if y == height - 1 or not mask[y + 1, x]: edges[(x + 1, y + 1)] = (x, y + 1)
        if x == 0 or not mask[y, x - 1]: edges[(x, y + 1)] = (x, y)
    loops = []
    while edges:
        start = next(iter(edges))
        point, loop = start, []
        while point in edges:
            loop.append(point)
            point = edges.pop(point)
            if point == start: break
        if len(loop) > 3: loops.append(loop)
    coast = max(loops, key=len)
    opposite = len(coast) // 2
    coast = simplify(coast[:opposite + 1])[:-1] + simplify(coast[opposite:] + [coast[0]])[:-1]
    return [[round(x / width * 100, 2), round(y / height * 100, 2)] for x, y in coast]


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "artwork/region-sheet.png"
    image = Image.open(source).convert("RGBA")
    assert image.size == (1536, 1024), "This extraction map matches the supplied 1536x1024 sheet."
    pixels = np.array(image)
    foreground = pixels[:, :, 3] > 128
    output = ROOT / "public/regions"
    output.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, (sx, sy) in SEEDS.items():
        assert foreground[sy, sx], f"Seed outside {name}"
        mask = np.zeros(foreground.shape, dtype=bool)
        mask[sy, sx] = True
        queue = deque([(sx, sy)])
        while queue:
            x, y = queue.popleft()
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < image.width and 0 <= ny < image.height and foreground[ny, nx] and not mask[ny, nx]:
                    mask[ny, nx] = True
                    queue.append((nx, ny))
        ys, xs = np.where(mask)
        assert len(xs) > 30000, f"Incomplete region: {name}"
        bounds = (max(0, int(xs.min()) - 3), max(0, int(ys.min()) - 3),
                  min(image.width, int(xs.max()) + 4), min(image.height, int(ys.max()) + 4))
        expanded = Image.fromarray(mask.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))
        tile = pixels.copy()
        tile[:, :, 3] = np.minimum(tile[:, :, 3], np.array(expanded))
        assert np.array_equal(tile[mask], pixels[mask]), f"Artwork pixels changed: {name}"
        sprite = Image.fromarray(tile).crop(bounds)
        sprite.save(output / f"{name}.webp", lossless=True, method=6)
        x0, y0, x1, y1 = bounds
        points = outline(mask[y0:y1, x0:x1])
        manifest[name] = {"src": f"/regions/{name}.webp", "width": sprite.width,
                          "height": sprite.height, "outline": points}
    assert len(manifest) == 18
    text = "// Coastlines are traced from the supplied artwork's alpha channel.\n"
    text += "export const ATLAS_REGIONS = " + json.dumps(manifest, separators=(",", ":")) + " as const;\n"
    (ROOT / "src/data/atlas-regions.ts").write_text(text, encoding="utf-8")
    print(f"Extracted and verified {len(manifest)} transparent, lossless region sprites.")


if __name__ == "__main__":
    main()
