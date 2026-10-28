import Image from "next/image";
import { ATLAS_REGIONS } from "@/data/atlas-regions";

export function StateArtwork({ id, priority = false }: { id: string; priority?: boolean }) {
  const region = ATLAS_REGIONS[id as keyof typeof ATLAS_REGIONS];
  return <span className="state-artwork" style={{ aspectRatio: `${region.width}/${region.height}` }}>
    <Image src={region.src} alt="" width={region.imageWidth} height={region.imageHeight}
      unoptimized priority={priority} draggable={false} style={{
        width: `${region.imageWidth / region.width * 100}%`,
        height: `${region.imageHeight / region.height * 100}%`,
        left: `${-region.offsetX / region.width * 100}%`,
        top: `${-region.offsetY / region.height * 100}%`,
      }} />
  </span>;
}
