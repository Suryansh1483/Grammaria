"use client";

import Image from "next/image";
import { Coins, Gem, ChevronDown, Crown } from "lucide-react";
import { PlayerState } from "@/types/game";

interface HeaderHUDProps {
  player: PlayerState;
  onOpenProfile: () => void;
  onOpenRewards: () => void;
}

export function HeaderHUD({ player, onOpenProfile, onOpenRewards }: HeaderHUDProps) {
  return (
    <header className="command-header">
      <div className="game-brand"><Crown aria-hidden="true" /><div><h1>Grammaria</h1><p>Conquer knowledge. Rule grammar.</p></div></div>
      <div className="command-header__center"><span className="status-dot" /> Your campaign continues</div>
      <div className="commander-resources" aria-label="Commander resources">
        <span><Coins aria-hidden="true" /><strong>{player.coins.toLocaleString()}</strong><small>Gold</small></span>
        <button onClick={onOpenRewards} aria-label={`${player.gems} gems. Open daily treasure`}><Gem aria-hidden="true" /><strong>{player.gems.toLocaleString()}</strong><small>Gems</small></button>
      </div>
      <button onClick={onOpenProfile} className="commander-button" aria-label={`Open commander profile for ${player.name}`}>
        <span className="commander-button__portrait"><Image src="/commander-arjun.png" width={48} height={64} alt="" /><small>{player.level}</small></span>
        <span><strong>{player.name}</strong><small>{player.className}</small></span><ChevronDown aria-hidden="true" />
      </button>
    </header>
  );
}
