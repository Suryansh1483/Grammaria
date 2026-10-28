"""Trace the old atlas's painted borders without modifying any artwork."""
import importlib.util
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('extract', ROOT / 'scripts/extract-regions.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
image = Image.open(ROOT / 'public/map-bg-ornate.jpg').convert('RGB')
pixels = np.array(image).astype(int)
centers = {'temporalia':(580,180),'artikel':(895,150),'concordia':(1210,180),'tagtown':(430,270),'position-point':(510,380),'centralia':(870,450),'voicelands':(1260,350),'mayhaven':(1460,465),'substitia':(330,525),'namesworth':(580,520),'junctionia':(1200,520),'ifshire':(1440,620),'passaggia':(365,690),'mannerton':(660,680),'lexicon-city':(1030,700),'quotehaven':(1380,750),'sequentia':(530,810),'descriptia':(800,795)}
barriers = []
for threshold in [155,185,200,210,220,230,240]:
    border = ((pixels[:,:,0]>threshold)&(pixels[:,:,1]>90)&(pixels[:,:,2]>30)&
              (pixels[:,:,0]-pixels[:,:,1]>10)&(pixels[:,:,0]-pixels[:,:,1]<90))
    barriers.append(Image.fromarray(border.astype('uint8')*255).filter(ImageFilter.MaxFilter(3)))
expected = {'temporalia':(350,300),'artikel':(330,240),'concordia':(440,220),'tagtown':(245,155),'position-point':(450,205),'centralia':(365,345),'voicelands':(520,235),'mayhaven':(355,225),'substitia':(245,210),'namesworth':(320,225),'junctionia':(340,220),'ifshire':(355,165),'passaggia':(270,195),'mannerton':(410,235),'lexicon-city':(365,345),'quotehaven':(410,270),'sequentia':(260,130),'descriptia':(325,220)}
result = {}
for name, (cx,cy) in centers.items():
    candidates = []
    left, top = max(0,cx-280), max(0,cy-230)
    right, bottom = min(image.width,cx+280), min(image.height,cy+230)
    for barrier in barriers:
        local = barrier.crop((left,top,right,bottom))
        seen = np.zeros((local.height,local.width),dtype=bool)
        for dx,dy in [(0,0),(-25,0),(25,0),(0,-25),(0,25),(-40,-20),(40,20),(-40,20),(40,-20),(-80,-20),(80,20),(-50,50),(50,-50)]:
            x,y = cx+dx-left, cy+dy-top
            if local.getpixel((x,y)) != 0 or seen[y,x]: continue
            filled = local.copy()
            ImageDraw.floodfill(filled,(x,y),128,thresh=0)
            mask = np.array(filled)==128
            seen |= mask
            ys,xs = np.where(mask)
            if len(xs)<3000: continue
            x0,y0,x1,y1 = int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())
            if x1-x0>expected[name][0]*1.1 or y1-y0>expected[name][1]*1.1: continue
            if x0==0 or y0==0 or x1==local.width-1 or y1==local.height-1: continue
            if abs((x0+x1)/2+left-cx)>100 or abs((y0+y1)/2+top-cy)>50: continue
            candidates.append((len(xs),mask,(x0+left,y0+top,x1+left,y1+top)))
    assert candidates, f'No enclosed region: {name}'
    _,mask,bounds = max(candidates,key=lambda item:item[0])
    mask = np.array(Image.fromarray(mask.astype('uint8')*255).filter(ImageFilter.MaxFilter(13)))>0
    points = [[round(x/100*mask.shape[1]+left,1),round(y/100*mask.shape[0]+top,1)] for x,y in module.outline(mask)]
    result[name] = {'points':points,'bounds':bounds}
    print(name,bounds,flush=True)
assert len(result)==18
(ROOT / 'src/data/atlas-coastlines.ts').write_text('// Original atlas coastlines, traced to conceal the flat artwork beneath a lifted state.\nexport const ATLAS_COASTLINES = '+json.dumps(result,separators=(',',':'))+' as const;\n')
