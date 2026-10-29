# Grammaria

An illustrated fantasy strategy game for learning English grammar. Players explore a living world map, meet realm guides, study grammar rules, and conquer territories through interactive challenges.

![Grammaria world map](public/map-bg-ornate.jpg)

## Highlights

- Interactive fantasy map with 18 grammar territories
- Individual transparent territory illustrations with coastline-aware hover and selection
- Pointer-anchored zoom, drag and touch panning, pinch zoom, and keyboard map controls
- Dedicated illustrated realm experiences for Artikel and Temporalia
- Distinct guardian portraits for all 18 realms, with dialogue and optional narration
- Clouds reserved for realm travel; iron-gate war banners and parchment-seal assessment transitions
- Battlefield fracture on victory, followed by a royal seal reveal, with skip and reduced-motion options
- Grammar study guides, examples, rewards, and battle questions
- Commander profile hall with campaign progress and mastery insights
- Daily quests, rewards, events, and leaderboard flows
- Responsive UI with reduced-motion accessibility support

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide icons
- Canvas Confetti

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Cinzel, Cormorant Garamond and Inter are bundled locally with their SIL Open Font licenses. Builds do not require Google Fonts access.

With the development server running, check the main game flows in a browser:

```bash
npx --package @playwright/cli playwright-cli open http://127.0.0.1:3000
npx --package @playwright/cli playwright-cli run-code --filename=tests/ui-smoke.pw
npx --package @playwright/cli playwright-cli run-code --filename=tests/atlas-interactions.pw
npx --package @playwright/cli playwright-cli run-code --filename=tests/guardians-and-transitions.pw
npx --package @playwright/cli playwright-cli run-code --filename=tests/victory-sequence.pw
```

Camera geometry tests use Node.js 24's TypeScript support:

```bash
npm test
```

## Atlas controls

Use + and − to zoom between 100% and 400%, or scroll over the map to zoom toward the pointer. Drag to pan. On touchscreens, drag with one finger or pinch with two. Reset restores the complete atlas. With the map focused, use +, −, arrow keys and R. The realm index provides a list alternative at every screen size.

Selecting a region lifts its complete illustration, then carries the player through a short cloud transition. Escape cancels travel or closes the current scene. Reduced-motion preferences skip cinematic movement. The map keeps its camera when returning from a realm.

The original region sheet and cloud asset provenance are documented in [artwork/README.md](artwork/README.md).

## Project structure

```text
src/
  app/                 App Router entry point and global theme
  components/          Map, HUD, actions, and game interfaces
  components/modals/   Territory, battle, profile, and reward experiences
  data/                Player, territory, and leaderboard content
  types/               Shared game types
public/                 Map, realm, and character artwork
```

## Gameplay loop

1. Select a territory on the map.
2. Meet its guide and inspect the study material.
3. Begin training or launch an attack.
4. Answer grammar challenges to reduce resistance.
5. Earn XP and coins, capture realms, and advance toward Centralia.

## Current status

Grammaria is an actively developed prototype. Major UI and gameplay milestones are committed separately so the project history remains easy to follow.

Progress and reward claims last for the current page session; refreshing resets the demo. Quests, rankings, and classroom events use sample data. Browser narration depends on installed system voices.
