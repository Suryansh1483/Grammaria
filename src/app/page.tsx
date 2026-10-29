"use client";

import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { GameOverlay } from '@/components/GameOverlay';
import { AtlasTransition } from '@/components/AtlasTransition';
import { WorldMap } from '@/components/WorldMap';
import { HeaderHUD } from '@/components/HeaderHUD';
import { SidebarActions } from '@/components/SidebarActions';
import { TerritoryModal } from '@/components/modals/TerritoryModal';
import { AttackModal } from '@/components/modals/AttackModal';
import { DailyChallengeModal } from '@/components/modals/DailyChallengeModal';
import { DailyRewardModal } from '@/components/modals/DailyRewardModal';
import { LeaderboardModal } from '@/components/modals/LeaderboardModal';
import { EventsModal } from '@/components/modals/EventsModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { INITIAL_PLAYER, INITIAL_TERRITORIES } from '@/data/territories';
import { Territory, PlayerState } from '@/types/game';

export default function Home() {
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);

  // Active Modals
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [attackTerritory, setAttackTerritory] = useState<Territory | null>(null);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [claimedQuests, setClaimedQuests] = useState<number[]>([]);
  const [treasureClaimed, setTreasureClaimed] = useState(false);
  const [travellingTo, setTravellingTo] = useState<Territory | null>(null);
  const travelLocked = useRef(false);
  const travelFocus = useRef<HTMLElement | null>(null);

  // Handle Territory Click from Map
  const handleSelectTerritory = (t: Territory) => {
    if (travelLocked.current) return;
    travelFocus.current = document.activeElement as HTMLElement | null;
    travelLocked.current = true;
    setTravellingTo(t);
  };
  const revealTerritory = useCallback((territory: Territory) => setSelectedTerritory(territory), []);
  const finishTravel = useCallback(() => { travelLocked.current = false; setTravellingTo(null); }, []);
  const cancelTravel = useCallback(() => {
    travelLocked.current = false;
    setTravellingTo(null);
    setSelectedTerritory(null);
    window.requestAnimationFrame(() => travelFocus.current?.focus());
  }, []);

  // Handle Launching Attack Session
  const handleStartAttack = (t: Territory) => {
    setAttackTerritory(t);
  };

  // Handle Successful Territory Capture
  const handleTerritoryCaptured = (territoryId: string, xpEarned: number, coinsEarned: number) => {
    setTerritories(prev =>
      prev.map(t =>
        t.id === territoryId
          ? { ...t, status: 'captured', enemyControl: 0 }
          : t
      )
    );

    setPlayer(prev => {
      const newXp = prev.xp + xpEarned;
      const newCapturedCount = prev.capturedTerritoriesCount + (attackTerritory?.status === 'captured' ? 0 : 1);
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;

      if (newXp >= newMaxXp) {
        newLevel += 1;
        newMaxXp += 2000;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        coins: prev.coins + coinsEarned,
        capturedTerritoriesCount: newCapturedCount,
      };
    });
  };

  // Handle Rewards from Daily Quest or Chest
  const handleClaimQuest = (id: number, amount: number, coins: number) => {
    if (claimedQuests.includes(id)) return;
    setClaimedQuests(previous => [...previous, id]);
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + amount,
      coins: prev.coins + coins,
    }));
  };

  const handleClaimRewardCoins = (coins: number, gems: number) => {
    if (treasureClaimed) return;
    setTreasureClaimed(true);
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + coins,
      gems: prev.gems + gems,
    }));
  };

  const closeScreen = () => {
    setSelectedTerritory(null);
    setAttackTerritory(null);
    setIsDailyChallengeOpen(false);
    setIsDailyRewardOpen(false);
    setIsLeaderboardOpen(false);
    setIsEventsOpen(false);
    setIsProfileOpen(false);
  };
  const screen = attackTerritory ? 'battle' : selectedTerritory ? `realm-${selectedTerritory.id}` :
    isDailyChallengeOpen ? 'quests' : isDailyRewardOpen ? 'treasure' : isLeaderboardOpen ? 'rankings' :
    isEventsOpen ? 'events' : isProfileOpen ? 'profile' : null;
  const kind = attackTerritory ? attackTerritory.status === 'captured' ? 'assessment' : 'battle' : selectedTerritory?.id === 'centralia' ? 'capital' :
    selectedTerritory ? 'realm' : isProfileOpen ? 'profile' : isDailyChallengeOpen ? 'quest' : isDailyRewardOpen ? 'reward' : isEventsOpen ? 'events' : 'panel';
  const screenLabel = attackTerritory ? `${attackTerritory.name} ${kind === 'assessment' ? 'assessment' : 'battle'}` : selectedTerritory ? `${selectedTerritory.name} realm` :
    isDailyChallengeOpen ? 'Daily quests' : isDailyRewardOpen ? 'Daily treasure' : isLeaderboardOpen ? 'Class rankings' :
    isEventsOpen ? 'Classroom assaults' : 'Commander profile';

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
    <main className="game-shell">
      <div inert={screen !== null || travellingTo !== null}>
      {/* Fixed Top HUD */}
      <HeaderHUD
        player={player}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRewards={() => setIsDailyRewardOpen(true)}
      />

      {/* Fixed Left Sidebar Actions */}
      <SidebarActions
        onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
        onOpenDailyReward={() => setIsDailyRewardOpen(true)}
        onOpenEvents={() => setIsEventsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Main Interactive Fantasy World Map Canvas */}
      <WorldMap
        territories={territories}
        onSelectTerritory={handleSelectTerritory}
        selectedTerritoryId={travellingTo?.id ?? selectedTerritory?.id ?? attackTerritory?.id}
        isTravelling={travellingTo !== null}
      />
      </div>

      <AnimatePresence mode="wait" custom={attackTerritory ? "battle" : null}>
      {screen && <GameOverlay key={screen} label={screenLabel} kind={kind} onClose={closeScreen} inputLocked={travellingTo !== null} title={attackTerritory?.name} returnFocus={selectedTerritory || attackTerritory ? travelFocus : undefined}>

      {/* Territory Detail & War Command Modal */}
      {selectedTerritory && !attackTerritory && <TerritoryModal
        territory={selectedTerritory}
        onClose={() => setSelectedTerritory(null)}
        onStartAttack={handleStartAttack}
      />}

      {/* Live Interactive Attack Battle Session Modal */}
      {attackTerritory && <AttackModal
        territory={attackTerritory}
        onClose={closeScreen}
        onTerritoryCaptured={handleTerritoryCaptured}
      />}

      {/* Daily Challenge Modal */}
      {isDailyChallengeOpen && (
        <DailyChallengeModal
          onClose={() => setIsDailyChallengeOpen(false)}
          claimed={claimedQuests}
          onClaimReward={handleClaimQuest}
        />
      )}

      {/* Daily Reward Modal */}
      {isDailyRewardOpen && (
        <DailyRewardModal
          onClose={() => setIsDailyRewardOpen(false)}
          claimed={treasureClaimed}
          onClaimRewards={handleClaimRewardCoins}
        />
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />
      )}

      {/* Events / Assaults Modal */}
      {isEventsOpen && (
        <EventsModal onClose={() => setIsEventsOpen(false)} />
      )}

      {/* Commander Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          player={player}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
      </GameOverlay>}
      </AnimatePresence>
      {travellingTo && <AtlasTransition territory={travellingTo} onCovered={revealTerritory} onComplete={finishTravel} onCancel={cancelTravel} />}
    </main>
    </MotionConfig>
  );
}
