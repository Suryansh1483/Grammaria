"use client";

import { Compass, Gift, Swords, Target, Trophy } from "lucide-react";

interface SidebarActionsProps {
  onOpenDailyChallenge: () => void;
  onOpenDailyReward: () => void;
  onOpenEvents: () => void;
  onOpenLeaderboard: () => void;
}

export function SidebarActions({ onOpenDailyChallenge, onOpenDailyReward, onOpenEvents, onOpenLeaderboard }: SidebarActionsProps) {
  const actions = [
    { label: "Daily Quest", icon: Target, action: onOpenDailyChallenge },
    { label: "Reward", icon: Gift, action: onOpenDailyReward },
    { label: "Assaults", icon: Swords, action: onOpenEvents },
    { label: "Ranking", icon: Trophy, action: onOpenLeaderboard },
  ];
  return (
    <nav className="campaign-nav" aria-label="Map actions">
      <div className="campaign-nav__current" aria-current="page"><Compass /><span>Atlas</span></div>
      {actions.map(({ label, icon: Icon, action }) => <button key={label} onClick={action} aria-label={label}><Icon aria-hidden="true" /><span>{label}</span></button>)}
      <span className="campaign-nav__end" aria-hidden="true">G</span>
    </nav>
  );
}
