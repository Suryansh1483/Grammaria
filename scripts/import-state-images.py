"""Import the user's individual PNGs unchanged and trace their alpha for hit testing."""
import hashlib
import importlib.util
import json
import shutil
from pathlib import Path
import numpy as np
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('extract_regions', ROOT / 'scripts/extract-regions.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
FILES = {
 'temporalia': 'Temporalia isolated fantasy map realm-1.png',
 'artikel': 'Isolated green Artikel state cutout-2.png',
 'concordia': 'Isolated Concordia map cutout-4.png',
 'tagtown': 'Tagtown State Map Cutout-3.png',
 'position-point': 'Isolated Orange Western Realm-5.png',
 'substitia': 'Isolated pink state of Substitia-7.png',
 'namesworth': 'Namesworth state isolated on transparent background-6.png',
 'centralia': 'Centralia State Map Cutout-3.png',
 'voicelands': 'Voicelands golden realm cutout-1.png',
 'junctionia': 'Junctionia state map cutout-2.png',
 'mayhaven': 'Mayhaven State Map Cutout-4.png',
 'ifshire': 'Isolated Ifshire map cutout-5.png',
 'passaggia': 'Passaggia State Isolated Map Cutout-6.png',
 'mannerton': 'Mannerton, the Golden South-7.png',
 'quotehaven': 'Quotehaven fantasy realm cutout-8.png',
 'descriptia': 'Isolated purple realm of Descriptia-9.png',
 'lexicon-city': 'Lexicon City State Cutout-10.png',
 'sequentia': 'Sequentia state transparent cutout-11.png',
}
manifest = {}
for name, filename in FILES.items():
 source = Path.home() / 'Downloads' / filename
 destination = ROOT / 'public/regions' / f'{name}.png'
 shutil.copyfile(source, destination)
 assert hashlib.sha256(source.read_bytes()).digest() == hashlib.sha256(destination.read_bytes()).digest()
 im = Image.open(source)
 alpha = np.array(im.getchannel('A'))
 mask = alpha > 128
 ys, xs = np.where(mask)
 x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max())+1, int(ys.max())+1
 manifest[name] = dict(src=f'/regions/{name}.png',width=x1-x0,height=y1-y0,imageWidth=im.width,imageHeight=im.height,offsetX=x0,offsetY=y0,outline=module.outline(mask[y0:y1,x0:x1]))
 assert 0.1 < mask.mean() < .9, name
text = '// Original supplied PNGs, with alpha-derived bounds and coastlines.\nexport const ATLAS_REGIONS = ' + json.dumps(manifest,separators=(',',':')) + ' as const;\n'
(ROOT / 'src/data/atlas-regions.ts').write_text(text,encoding='utf-8')
print('Verified 18 byte-identical PNGs, transparent bounds and silhouette hit areas.')
