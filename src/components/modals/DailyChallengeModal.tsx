"use client";

import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import { BookOpen, Check, CheckCircle2, ChevronRight, Clock3, Coins, Flame, ShieldCheck, Sparkles, Swords, Target, Trophy, X, Zap } from "lucide-react";

interface DailyChallengeModalProps { onClose: () => void; claimed: number[]; onClaimReward: (id: number, xp: number, coins: number) => void; }

const quests = [
  { id: 1, title: "Break Two Defenses", desc: "Challenge any two active territories and weaken their resistance.", xp: 150, coins: 200, progress: "1 / 2", percent: 50, icon: Swords, tier: "Battle order" },
  { id: 2, title: "Perfect Grammar Streak", desc: "Answer three consecutive battle questions without a failed strike.", xp: 200, coins: 300, progress: "3 / 3", percent: 100, icon: Flame, tier: "Elite order" },
  { id: 3, title: "Gather Realm Intelligence", desc: "Open a study guide and inspect the rules of an unconquered realm.", xp: 100, coins: 150, progress: "1 / 1", percent: 100, icon: BookOpen, tier: "Scholar order" },
];

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ onClose, claimed, onClaimReward }) => {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const compact = "inset(49.5% 0 49.5% 0)";
  const completedCount = quests.filter((quest) => quest.percent === 100).length;
  const claimedXP = quests.filter((quest) => claimed.includes(quest.id)).reduce((sum, quest) => sum + quest.xp, 0);

  const handleClaim = (id: number, xp: number, coins: number) => {
    if (claimed.includes(id)) return;
    onClaimReward(id, xp, coins);
  };

  return (
    <div className="quest-board" role="dialog" aria-modal="true" aria-label="Daily grammar quests">
      <div className="quest-board__backdrop" />
      <section className="quest-scroll" data-phase={present ? "enter" : "exit"}>
        <motion.div className="quest-scroll__paper" aria-hidden="true" initial={{ clipPath: reduced ? "inset(0)" : compact }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: reduced ? "inset(0)" : compact }} transition={{ duration: reduced ? .08 : .6, ease: [.65, 0, .25, 1] }} />
        <span className="quest-scroll__rod quest-scroll__rod--top" /><span className="quest-scroll__rod quest-scroll__rod--bottom" />
        <motion.div className="quest-scroll__ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .12 } }} transition={{ delay: reduced ? 0 : .32, duration: .22 }}>
        <button type="button" onClick={onClose} className="quest-board__close" aria-label="Close daily quests"><X /></button>

        <header className="quest-board__header">
          <div className="quest-board__seal"><Target /><span /></div>
          <div><small>Royal command board · Day 5</small><h2>Daily Quests</h2><p>Complete today&apos;s orders before the moon crosses Centralia.</p></div>
          <div className="quest-board__timer"><Clock3 /><span><small>New orders in</small><strong>14h 22m</strong></span></div>
        </header>

        <div className="quest-summary">
          <div className="quest-summary__streak"><Flame /><span><small>Current streak</small><strong>5 days</strong></span></div>
          <div className="quest-summary__progress"><div><span>Daily campaign</span><strong>{completedCount} / {quests.length} ready</strong></div><div className="quest-summary__track"><motion.i initial={{ width: 0 }} animate={{ width: `${(completedCount / quests.length) * 100}%` }} transition={{ delay: .3, duration: .7 }} /></div></div>
          <div className="quest-summary__earned"><Sparkles /><span><small>Claimed today</small><strong>{claimedXP} XP</strong></span></div>
        </div>

        <div className="quest-list">
          {quests.map((quest, index) => {
            const Icon = quest.icon;
            const isReady = quest.percent === 100;
            const isClaimed = claimed.includes(quest.id);
            return (
              <motion.article key={quest.id} className={`quest-card ${isReady ? "is-ready" : ""} ${isClaimed ? "is-claimed" : ""}`} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + index * .08 }}>
                <div className="quest-card__number">0{index + 1}</div>
                <div className="quest-card__crest"><Icon /></div>
                <div className="quest-card__copy">
                  <h3>{quest.title}</h3><small>{quest.tier}</small><p>{quest.desc}</p>
                  <div className="quest-card__progress"><div><span style={{ width: `${quest.percent}%` }} /></div><strong>{quest.progress}</strong></div>
                </div>
                <div className="quest-card__reward">
                  <span><Zap /> +{quest.xp} XP</span><span><Coins /> +{quest.coins}</span>
                  <button type="button" disabled={!isReady || isClaimed} onClick={() => handleClaim(quest.id, quest.xp, quest.coins)}>
                    {isClaimed ? <><CheckCircle2 /> Claimed</> : isReady ? <><Trophy /> Claim</> : <>In progress <ChevronRight /></>}
                  </button>
                </div>
                {isClaimed && <motion.div className="quest-card__stamp" initial={{ scale: 1.7, rotate: -18, opacity: 0 }} animate={{ scale: 1, rotate: -9, opacity: 1 }}><Check /> Claimed</motion.div>}
              </motion.article>
            );
          })}
        </div>

        <AnimatePresence>
          {claimed.length === completedCount && completedCount > 0 && (
            <motion.div className="quest-bonus" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <ShieldCheck /><div><small>Daily campaign complete</small><strong>Royal bonus unlocked</strong><p>Return tomorrow to extend your streak and receive new orders.</p></div><span><Sparkles /> +1 Streak</span>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
};
