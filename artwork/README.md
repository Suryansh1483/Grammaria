# Atlas artwork

The active atlas uses the 18 individual PNGs supplied on October 27, 2026. `scripts/import-state-images.py` maps filenames to territory IDs, copies each PNG byte-for-byte into `public/regions/`, verifies SHA-256 equality, and derives transparent bounds and silhouette hit areas. `src/data/atlas-regions.ts` records the source dimensions and offsets; the browser hides only transparent padding. No illustration is repainted, stretched, or replaced. The earlier `region-sheet.png` and WebP exports are retained as source history and are not rendered.

The supplied images contain embedded territory names. These remain part of the artwork. The live region title, topic and status are separate HTML in the atlas's contextual footer.

The original `public/map-bg-ornate.jpg` is the atlas base. At rest the sprite overlays stay transparent, preserving the original geography. Each separated illustration is positioned over its corresponding region and appears with lift and depth on hover or selection. Map labels keep their original positions.

`scripts/trace-atlas-coastlines.py` traces the original painted borders into `src/data/atlas-coastlines.ts`. Placement uses those original centers and widths. During lift, a silhouette-shaped layer samples the atlas's own sea texture to cover the flattened state below, avoiding doubled artwork. Both layers return smoothly on hover-out. Some supplied outlines differ from the flattened atlas; their natural proportions take precedence over forcing a pixel-identical coastline through distortion.

Quests use a masked parchment surface with independently moving rollers and ink. Shared overlays retain children through exit, lock exiting controls, restore focus, and use distinct realm, battle, reward, profile and event motion. Reduced-motion preferences remove spatial effects. Browser checks live in `tests/atlas-interactions.pw`, `tests/motion-lifecycle.pw` and `tests/ui-smoke.pw`.

`public/effects/cloud-veil.png` was generated with the built-in ImageGen tool for the cinematic cloud layers. The original generated file remains in the local generated-image library. Generation prompt:

> Create a single production game VFX sprite: a long horizontal bank of layered atmospheric clouds and fog for an elegant illustrated fantasy atlas scene transition. Wide 3:2 canvas. Genuine transparent alpha background. Hand-painted high-end fantasy environment treatment, subtle brush texture and volumetric folds, cool pearl, warm ivory and slate shadows. Dense opaque cloud core across center horizontal band, irregular billowing wisps tapering to transparency at all four edges, composition stretches nearly full width with generous soft transparent edges. Quiet warm rim light, no bright glow. No terrain, no land, no buildings, no text, no icons, no border. This is a cloud texture layer to translate across a full-screen game scene, not a scene illustration. Detailed natural turbulent cloud forms, not circles or cartoon puffs.

Display typography uses Cormorant Garamond. Cinzel remains the game wordmark and Inter supplies interface text. Font files and their original SIL Open Font licenses are in `public/fonts/`.


## Realm guardians

The original Lady Aurelia, Master Caelum and Grammarch portraits are preserved. Fifteen additional distinct full-body guardians are saved in `public/characters/`; `src/data/realm-guides.ts` binds each to its realm, role, dialogue and palette. Their genuine transparent PNGs were generated with built-in ImageGen. The exact prompt set and final asset mapping are in `guardian-prompts.json`. Original generated files remain in the local image library.

New realm stages use a view into the existing illustrated atlas as scenery. Artikel, Temporalia and Centralia retain their established landscapes. Guardian narration uses the browser's speech synthesis, starts only on request, and cancels on navigation. Voice availability and timbre depend on the browser and installed voices.

Cloud layers appear only during entry from the atlas and return to it. Launching a battle suppresses the departing realm's cloud layer. Battles and the war council use iron gates and cloth standards; training assessments use parchment and a wax seal. Their entrance and exit sequences retain the existing focus, input-locking and reduced-motion behavior.
