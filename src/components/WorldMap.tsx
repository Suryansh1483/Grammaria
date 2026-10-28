"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StateArtwork } from "./StateArtwork";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, Crown, List, LockKeyhole, Map, Minus, Plus, RotateCcw, ShieldCheck, Swords } from "lucide-react";
import { Territory } from "@/types/game";
import { ATLAS_REGIONS } from "@/data/atlas-regions";
import { ATLAS_LAYOUT } from "@/data/atlas-layout";
import { ATLAS_COASTLINES } from "@/data/atlas-coastlines";
import { clampCamera, fitScale, zoomAt, WORLD_SIZE, type Camera, type Viewport } from "@/lib/atlas-camera";

interface WorldMapProps {
  territories: Territory[];
  onSelectTerritory: (territory: Territory) => void;
  selectedTerritoryId?: string | null;
  isTravelling?: boolean;
}

const statusCopy: Record<Territory["status"], string> = {
  captured: "Conquered", accessible: "Open frontier", "enemy-controlled": "Enemy held",
  "capital-locked": "Locked capital", locked: "Locked",
};

function StatusMark({ status }: { status: Territory["status"] }) {
  if (status === "captured") return <ShieldCheck />;
  if (status === "enemy-controlled") return <Swords />;
  if (status === "capital-locked") return <Crown />;
  if (status === "locked") return <LockKeyhole />;
  return <Compass />;
}

const regionShapes = Object.fromEntries(Object.entries(ATLAS_REGIONS).map(([id, region]) => [id, {
  ...region,
  clip: `polygon(${region.outline.map(([x, y]) => `${x}% ${y}%`).join(",")})`,
  points: region.outline.map(([x, y]) => `${x},${y}`).join(" "),
}]));

export function WorldMap({ territories, onSelectTerritory, selectedTerritoryId, isTravelling = false }: WorldMapProps) {
  const [hoveredTerritory, setHoveredTerritory] = useState<Territory | null>(null);
  const [view, setView] = useState<"atlas" | "index">("atlas");
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [viewport, setViewport] = useState<Viewport>({ width: 1, height: 1 });
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const cameraRef = useRef(camera);
  const viewportRef = useRef(viewport);
  const firstMeasurement = useRef(true);
  const pointers = useRef(new globalThis.Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; camera: Camera } | null>(null);
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const suppressClick = useRef(false);
  const reduced = useReducedMotion();
  const captured = territories.filter(territory => territory.status === "captured").length;
  const target = hoveredTerritory ?? territories.find(territory => territory.id === selectedTerritoryId) ?? territories.find(territory => territory.status === "enemy-controlled") ?? territories[0];

  const updateCamera = useCallback((next: Camera) => {
    const bounded = clampCamera(next, viewportRef.current);
    cameraRef.current = bounded;
    setCamera(bounded);
  }, []);

  const zoom = useCallback((value: number, point = { x: 0, y: 0 }) => {
    updateCamera(zoomAt(cameraRef.current, value, point, viewportRef.current));
  }, [updateCamera]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const size = { width: entry.contentRect.width, height: entry.contentRect.height };
      pointers.current.clear();
      drag.current = null;
      pinch.current = null;
      setDragging(false);
      viewportRef.current = size;
      setViewport(size);
      updateCamera(firstMeasurement.current && size.width < 650 ? { x: 0, y: 0, zoom: 2 } : cameraRef.current);
      firstMeasurement.current = false;
    });
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isTravelling) return;
      const bounds = element.getBoundingClientRect();
      zoom(cameraRef.current.zoom * Math.exp(-event.deltaY * .002), {
        x: event.clientX - bounds.left - bounds.width / 2,
        y: event.clientY - bounds.top - bounds.height / 2,
      });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => { observer.disconnect(); element.removeEventListener("wheel", wheel); };
  }, [view, zoom, updateCamera, isTravelling]);

  const focusRegion = (territory: Territory) => {
    setHoveredTerritory(territory);
    const position = ATLAS_LAYOUT[territory.id];
    const size = viewportRef.current;
    const scale = fitScale(size) * cameraRef.current.zoom;
    const x = (position.x / 100 - .5) * WORLD_SIZE.width * scale;
    const y = (position.y / 100 - .5) * WORLD_SIZE.height * scale;
    if (Math.abs(x + cameraRef.current.x) > size.width / 2 - 60 || Math.abs(y + cameraRef.current.y) > size.height / 2 - 60) {
      updateCamera({ ...cameraRef.current, x: -x, y: -y });
    }
  };

  return (
    <section className="campaign-atlas illustrated-atlas" aria-label="Interactive map of Grammaria" aria-busy={isTravelling}>
      <div className="atlas-toolbar">
        <div><Compass aria-hidden="true" /><h2>World atlas</h2><span>{territories.length} realms. One unfolding story.</span></div>
        <div className="atlas-switch" aria-label="Map display">
          <button onClick={() => { setView("atlas"); setHoveredTerritory(null); }} aria-pressed={view === "atlas"}><Map /> Atlas</button>
          <button onClick={() => { setView("index"); setHoveredTerritory(null); }} aria-pressed={view === "index"}><List /> Realms</button>
        </div>
      </div>
      {view === "atlas" ? <div className={`atlas-viewport ${dragging ? "is-dragging" : ""} ${selectedTerritoryId ? "has-selection" : ""}`}
        data-zoomed={camera.zoom > 1}
        ref={stage} tabIndex={0} aria-label="World map. Scroll or pinch to zoom. Drag to pan. Use plus, minus, arrow keys, or R to reset."
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (["+", "=", "-", "r", "R", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
          if (event.key === "+" || event.key === "=") zoom(cameraRef.current.zoom + .25);
          if (event.key === "-") zoom(cameraRef.current.zoom - .25);
          if (event.key.toLowerCase() === "r") updateCamera({ x: 0, y: 0, zoom: 1 });
          const offsets: Record<string, [number, number]> = { ArrowLeft: [70, 0], ArrowRight: [-70, 0], ArrowUp: [0, 70], ArrowDown: [0, -70] };
          if (offsets[event.key]) updateCamera({ ...cameraRef.current, x: cameraRef.current.x + offsets[event.key][0], y: cameraRef.current.y + offsets[event.key][1] });
        }}
        onPointerDown={event => {
          if (event.button !== 0 || isTravelling || pointers.current.size >= 2) return;
          suppressClick.current = false;
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          drag.current = { x: event.clientX, y: event.clientY, camera: cameraRef.current };
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: cameraRef.current.zoom };
          }
        }}
        onPointerMove={event => {
          if (!pointers.current.has(event.pointerId) || !drag.current) return;
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          if (pointers.current.size === 2 && pinch.current) {
            const [a, b] = [...pointers.current.values()];
            const bounds = event.currentTarget.getBoundingClientRect();
            zoom(pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.distance), {
              x: (a.x + b.x) / 2 - bounds.left - bounds.width / 2,
              y: (a.y + b.y) / 2 - bounds.top - bounds.height / 2,
            });
            suppressClick.current = true;
            setDragging(true);
          } else {
            const dx = event.clientX - drag.current.x;
            const dy = event.clientY - drag.current.y;
            if (Math.hypot(dx, dy) < 6 && !suppressClick.current) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            suppressClick.current = true;
            setDragging(true);
            setHoveredTerritory(null);
            updateCamera({ ...drag.current.camera, x: drag.current.camera.x + dx, y: drag.current.camera.y + dy });
          }
        }}
        onPointerUp={event => {
          if (!pointers.current.has(event.pointerId)) return;
          pointers.current.delete(event.pointerId);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (pointers.current.size === 0) { drag.current = null; pinch.current = null; setDragging(false); }
          else {
            const point = [...pointers.current.values()][0];
            drag.current = { ...point, camera: cameraRef.current };
            pinch.current = null;
          }
        }}
        onPointerCancel={() => { pointers.current.clear(); drag.current = null; pinch.current = null; setDragging(false); suppressClick.current = true; }}
        onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
        <div className="atlas-atmosphere" aria-hidden="true" />
        <motion.div className="atlas-world" style={{ width: WORLD_SIZE.width, height: WORLD_SIZE.height, marginLeft: -WORLD_SIZE.width / 2, marginTop: -WORLD_SIZE.height / 2 }}
          initial={false} animate={{ x: camera.x, y: camera.y, scale: fitScale(viewport) * camera.zoom }}
          transition={{ duration: reduced || dragging ? 0 : .3, ease: [.22, 1, .36, 1] }}>
          <Image className="atlas-original-map" src="/map-bg-ornate.jpg" alt="Original illustrated world map of Grammaria" width={WORLD_SIZE.width} height={WORLD_SIZE.height} unoptimized priority draggable={false} />
          <svg className="atlas-lift-beds" viewBox={`0 0 ${WORLD_SIZE.width} ${WORLD_SIZE.height}`} aria-hidden="true">
            <defs><pattern id="atlas-water" width="96" height="96" patternUnits="userSpaceOnUse"><image href="/map-bg-ornate.jpg" x="-70" y="-80" width={WORLD_SIZE.width} height={WORLD_SIZE.height} /></pattern></defs>
            {Object.entries(ATLAS_COASTLINES).map(([id, coast]) => <polygon key={id}
              points={coast.points.map(([x,y]) => `${x},${y}`).join(" ")}
              fill="url(#atlas-water)" className={hoveredTerritory?.id === id || selectedTerritoryId === id ? "is-visible" : ""} />)}
          </svg>
          {territories.map(territory => {
            const region = regionShapes[territory.id];
            const position = ATLAS_LAYOUT[territory.id];
            const selected = selectedTerritoryId === territory.id;
            return <div key={territory.id}
              className={`atlas-region atlas-region--${territory.status} ${hoveredTerritory?.id === territory.id ? "is-hovered" : ""} ${selected ? "is-selected" : ""}`}
              style={{ left: `${position.x}%`, top: `${position.y}%`, width: position.width, aspectRatio: `${region.width}/${region.height}` }}>
              <button type="button" className="atlas-region__hit" style={{ clipPath: region.clip }}
                aria-label={`${territory.name}, ${territory.topic}. ${statusCopy[territory.status]}`} aria-pressed={selected}
                onClick={() => { if (!suppressClick.current && !isTravelling) onSelectTerritory(territory); }}
                onPointerEnter={event => { if (event.pointerType !== "touch" && !dragging) setHoveredTerritory(territory); }}
                onPointerLeave={() => setHoveredTerritory(null)} onFocus={() => focusRegion(territory)} onBlur={() => setHoveredTerritory(null)} />
              <div className="atlas-region__relief"><StateArtwork id={territory.id} priority /></div>
              <span className="atlas-region__label" aria-hidden="true" style={{
                left: `${50 + (territory.x - position.x) / 100 * WORLD_SIZE.width / position.width * 100}%`,
                top: `${50 + (territory.y - position.y) / 100 * WORLD_SIZE.height / (position.width * region.height / region.width) * 100}%`,
              }}><strong><StatusMark status={territory.status} />{territory.name}</strong><em>{territory.alias}</em></span>
              <svg className="atlas-region__coast" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={region.points} vectorEffect="non-scaling-stroke" /></svg>
            </div>;
          })}
        </motion.div>
        <span className="atlas-help">Scroll or pinch to zoom · Drag to explore</span>
        <div className="atlas-zoom" aria-label="Atlas zoom controls" onPointerDown={event => event.stopPropagation()} onPointerMove={event => event.stopPropagation()}>
          <button onClick={() => zoom(cameraRef.current.zoom + .25)} disabled={camera.zoom >= 4} aria-label="Zoom in"><Plus /></button>
          <output aria-live="polite" aria-label="Zoom level">{Math.round(camera.zoom * 100)}%</output>
          <button onClick={() => zoom(cameraRef.current.zoom - .25)} disabled={camera.zoom <= 1} aria-label="Zoom out"><Minus /></button>
          <button onClick={() => updateCamera({ x: 0, y: 0, zoom: 1 })} disabled={camera.zoom === 1 && camera.x === 0 && camera.y === 0} aria-label="Reset atlas view"><RotateCcw /></button>
        </div>
      </div> : <div className="realm-index">{territories.map(territory => <button key={territory.id} onClick={() => onSelectTerritory(territory)} className={`realm-index__entry realm-index__entry--${territory.status}`}><StatusMark status={territory.status} /><span><strong>{territory.name}</strong><small>{territory.topic}</small></span><span>{statusCopy[territory.status]}</span><ArrowRight /></button>)}</div>}
      <footer className="campaign-footer">
        <div className="campaign-progress"><ShieldCheck /><div><strong>{captured} <span>/ {territories.length} realms secured</span></strong><div className="campaign-progress__track"><span style={{ width: `${captured / territories.length * 100}%` }} /></div></div></div>
        <div className="frontier-brief" aria-live="polite"><span className="frontier-brief__icon"><StatusMark status={target.status} /></span><div><strong key={target.id}>{target.name}</strong><span>{target.topic} · {statusCopy[target.status]}</span></div></div>
        <button className="game-primary" onClick={() => onSelectTerritory(target)}>Enter realm <ArrowRight /></button>
      </footer>
    </section>
  );
}
