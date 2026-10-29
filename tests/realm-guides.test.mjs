import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { REALM_GUIDES } from '../src/data/realm-guides.ts';
import { ATLAS_COASTLINES } from '../src/data/atlas-coastlines.ts';

const realms = Object.keys(ATLAS_COASTLINES).filter(id => id !== 'centralia').sort();
assert.deepEqual(Object.keys(REALM_GUIDES).sort(), realms);
assert.equal(new Set(Object.values(REALM_GUIDES).map(guide => guide.guide)).size, 17);
assert.equal(new Set(Object.values(REALM_GUIDES).map(guide => guide.guideName)).size, 17);
for (const [id, guide] of Object.entries(REALM_GUIDES)) {
  assert.ok(existsSync(new URL(`../public${guide.guide}`, import.meta.url)), `${id}: missing portrait`);
  assert.ok(guide.guideTitle && guide.intro && guide.dialogue.length >= 2, `${id}: incomplete character`);
  assert.ok(guide.dialogue.every(line => line.trim().length > 25), `${id}: missing dialogue`);
}
assert.ok(existsSync(new URL('../public/centralia-grammarch.png', import.meta.url)));
console.log('All 18 realms have distinct portraits; all 17 guides have complete names, roles and dialogue.');
