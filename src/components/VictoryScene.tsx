"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { Crown, ArrowRight, Coins, Sparkles } from "lucide-react";
import type { Territory } from "@/types/game";

export interface BattleSnapshot { element: HTMLElement; left: number; top: number; width: number; height: number; }

// Shared edges keep the frozen battlefield seamless before its twelve pieces separate.
const shards = [
  "0 0,27% 0,22% 36%,0 30%", "27% 0,51% 0,55% 31%,22% 36%",
  "51% 0,76% 0,73% 37%,55% 31%", "76% 0,100% 0,100% 32%,73% 37%",
  "0 30%,22% 36%,28% 67%,0 70%", "22% 36%,55% 31%,48% 71%,28% 67%",
  "55% 31%,73% 37%,79% 66%,48% 71%", "73% 37%,100% 32%,100% 72%,79% 66%",
  "0 70%,28% 67%,23% 100%,0 100%", "28% 67%,48% 71%,53% 100%,23% 100%",
  "48% 71%,79% 66%,75% 100%,53% 100%", "79% 66%,100% 72%,100% 100%,75% 100%",
];

export function VictoryScene({ territory, snapshot, onClose }: {
  territory: Territory; snapshot: RefObject<BattleSnapshot | null>; onClose: () => void;
}) {
  const debris = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [skipped, setSkipped] = useState(false);
  const [settled, setSettled] = useState(false);
  const skipButton = useRef<HTMLButtonElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const assessment = territory.status === "captured";

  useEffect(() => {
    (skipped || settled || reduced ? returnButton : skipButton).current?.focus();
  }, [skipped, settled, reduced]);

  useLayoutEffect(() => {
    const stage = debris.current;
    const frame = snapshot.current;
    if (!stage || !frame || reduced || skipped) return;
    for (const [index, polygon] of shards.entries()) {
      const piece = document.createElement("div");
      piece.className = "victory-shard";
      const column = index % 4;
      piece.style.cssText = `left:${frame.left}px;top:${frame.top}px;width:${frame.width}px;height:${frame.height}px;clip-path:polygon(${polygon});--drift:${(column - 1.5) * 18}vw;--turn:${(column - 1.5) * 19}deg;--delay:${Math.floor(index / 4) * 45}ms`;
      const copy = frame.element.cloneNode(true) as HTMLElement;
      copy.style.cssText = `width:${frame.width}px;height:${frame.height}px;max-width:none;transform:none;opacity:1;margin:0;`;
      copy.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      piece.append(copy);
      stage.append(piece);
    }
    const timer = window.setTimeout(() => stage.replaceChildren(), 1700);
    return () => { window.clearTimeout(timer); stage.replaceChildren(); };
  }, [snapshot, reduced, skipped]);

  return <section className="victory-scene" data-skipped={skipped} aria-label={assessment ? "Assessment victory" : "Conquest victory"}>
    <div ref={debris} className="victory-debris" inert aria-hidden="true" />
    <div className="victory-fracture" aria-hidden="true" />
    <button ref={skipButton} className="victory-skip" hidden={settled || !!reduced} onClick={() => setSkipped(true)}>Skip celebration</button>
    <div className="victory-reveal" role="status" inert={!skipped && !settled && !reduced}
      onAnimationEnd={event => { if (event.target === event.currentTarget) setSettled(true); }}>
      <div className="victory-seal" aria-hidden="true"><span /><Crown /><span /></div>
      <h2>{assessment ? "ASSESSMENT CONQUERED!" : "TERRITORY CAPTURED!"}</h2>
      <p className="victory-realm">{territory.name}</p>
      <p>{assessment ? "Your knowledge holds. Another trial has fallen." : "The defenses have fallen. Your standard now flies over this realm."}</p>
      <div className="victory-spoils"><span><Sparkles /> +{territory.xpReward} XP Earned</span><span><Coins /> +{territory.coinsReward} Coins Earned</span></div>
      <button ref={returnButton} className="victory-return" onClick={onClose}>RETURN TO MAP <ArrowRight /></button>
    </div>
  </section>;
}
