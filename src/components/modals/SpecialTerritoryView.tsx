"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, Check, ChevronRight, Clock3, Coins, ScrollText, ShieldCheck, Sparkles, Swords, Trophy, Volume2, VolumeX, LockKeyhole } from "lucide-react";
import { Territory } from "@/types/game";
import { REALM_GUIDES } from "@/data/realm-guides";
import { ATLAS_LAYOUT } from "@/data/atlas-layout";

interface SpecialTerritoryViewProps {
  territory: Territory;
  onClose: () => void;
  onStartAttack: (territory: Territory) => void;
}

export function SpecialTerritoryView({ territory, onClose, onStartAttack }: SpecialTerritoryViewProps) {
  const [section, setSection] = useState<"overview" | "academy">("overview");
  const [dialogueStep, setDialogueStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const theme = REALM_GUIDES[territory.id];
  const introducing = dialogueStep < theme.dialogue.length;
  const captured = territory.status === "captured";
  const locked = territory.status === "locked" || territory.status === "capital-locked";
  const originalRealm = territory.id === "artikel" || territory.id === "temporalia";
  const Crest = territory.id === "artikel" ? ScrollText : territory.id === "temporalia" ? Clock3 : BookOpen;
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const stopVoice = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };
  const hearGuardian = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { stopVoice(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(introducing ? theme.dialogue[dialogueStep] : section === "academy" ? territory.studyGuide.summary : theme.intro);
    utterance.lang = "en-IN";
    utterance.rate = .9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AnimatePresence>
      <motion.div className={`territory-screen territory-screen--${theme.accent} ${theme.landscape ? "" : "territory-screen--guardian"}`} data-realm={territory.id} data-status={territory.status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {theme.landscape ? <Image src={theme.landscape} alt={`Fantasy landscape of ${territory.name}`} fill priority sizes="100vw" className="territory-screen__art" /> : <div className="territory-screen__realm-art" aria-hidden="true" style={{ backgroundPosition: `${ATLAS_LAYOUT[territory.id].x}% ${ATLAS_LAYOUT[territory.id].y}%` }} />}
        <div className="territory-screen__shade" />

        <motion.div
          className="territory-guide"
          initial={{ x: 150, opacity: 0, scale: .94 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 75, damping: 18, delay: .15 }}
        >
          <div className="territory-guide__aura" />
          <Image src={theme.guide} alt={`${theme.guideName}, ${theme.guideTitle}`} width={1024} height={1536} priority sizes="(max-width: 820px) 55vw, 38vw" className="territory-guide__image" />
        </motion.div>

        <motion.button type="button" onClick={onClose} className="territory-back" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <ArrowLeft /> <span>World Map</span>
        </motion.button>

        <button type="button" className="guardian-voice" onClick={hearGuardian} aria-label={speaking ? "Stop guardian voice" : "Hear guardian"}>{speaking ? <VolumeX /> : <Volume2 />}</button>
        <div className={`territory-screen__content ${dialogueStep < theme.dialogue.length ? "is-introducing" : ""}`}>
          <motion.header initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 }}>
            <div className="territory-crest"><Crest /><span className="territory-crest__ring" /></div>
            <h2>{territory.name}</h2>
            <span className="territory-alias">{territory.alias}</span>
            <div className="territory-status">{captured ? <ShieldCheck /> : locked ? <LockKeyhole /> : <Swords />}{captured ? "Territory secured" : locked ? "Gates sealed" : "Frontier contested"} · Level {territory.levelRequired}</div>
          </motion.header>

          <motion.div className="territory-command" inert={introducing} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: dialogueStep >= theme.dialogue.length ? 1 : .2 }} transition={{ delay: .2 }}>
            <nav>
              <button type="button" onClick={() => setSection("overview")} aria-pressed={section === "overview"} className={section === "overview" ? "is-active" : ""}><Sparkles /> {originalRealm ? "Overview" : "War Command"}</button>
              <button type="button" onClick={() => setSection("academy")} aria-pressed={section === "academy"} className={section === "academy" ? "is-active" : ""}><BookOpen /> {originalRealm ? "Academy" : "Topic Study Guide"}</button>
            </nav>

            <AnimatePresence mode="wait">
              {section === "overview" ? (
                <motion.div key="overview" className="territory-pane" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <p className="territory-intro">{theme.intro}</p>
                  <div className="guardian-resistance"><span>{captured ? "Student control" : "Enemy resistance"}</span><strong>{captured ? "Secured" : `${territory.enemyControl}%`}</strong><div><i style={{ width: `${captured ? 100 : territory.enemyControl}%` }} /></div></div>
                  <div className="territory-objective">
                    <span><Trophy /></span>
                    <div><small>Mastery mission</small><strong>{territory.topic}</strong><p>{territory.description}</p></div>
                  </div>
                  <div className="territory-rewards">
                    <div><Sparkles /><span><small>Victory XP</small><strong>+{territory.xpReward}</strong></span></div>
                    <div><Coins /><span><small>Gold reward</small><strong>+{territory.coinsReward}</strong></span></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="academy" className="territory-pane territory-pane--academy" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <h3>Core Grammar Rule</h3><p className="territory-intro">{territory.studyGuide.summary}</p><h3>Key Tactical Rules</h3>
                  <div className="territory-rules">
                    {territory.studyGuide.keyRules.map((rule, index) => <div key={rule}><span>{index + 1}</span><p>{rule}</p></div>)}
                  </div>
                  <h3>Battlefield Examples</h3>{territory.studyGuide.examples.map(example => <div key={example.correct} className="territory-example"><Check /><span><small>Correct</small>{example.correct}<small className="guardian-incorrect">Incorrect: {example.incorrect}</small></span></div>)}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="button" className="territory-cta" disabled={locked} onClick={() => { onClose(); onStartAttack(territory); }}>
              <span><Swords /> {locked ? "Realm locked" : captured ? "Begin Training" : "LAUNCH ATTACK"}</span><ChevronRight />
            </button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {dialogueStep < theme.dialogue.length && (
            <motion.div
              key={dialogueStep}
              className="guide-dialogue"
              initial={{ opacity: 0, y: 24, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: .28 }}
            >
              <div className="guide-dialogue__speaker">
                <span>{theme.guideName}</span>
                <small>{theme.guideTitle}</small>
              </div>
              <p>{theme.dialogue[dialogueStep]}</p>
              <div className="guide-dialogue__actions">
                <button type="button" onClick={() => { stopVoice(); setDialogueStep(theme.dialogue.length); }} className="guide-dialogue__skip">Skip</button>
                <button type="button" onClick={() => { stopVoice(); setDialogueStep((step) => step + 1); }} className="guide-dialogue__next">
                  {dialogueStep === theme.dialogue.length - 1 ? "Enter Realm" : "Continue"}<ChevronRight />
                </button>
              </div>
              <span className="guide-dialogue__tail" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="territory-screen__hint">{originalRealm ? "Open the academy" : "Open the study guide"} to inspect the grammar scrolls</span>
      </motion.div>
    </AnimatePresence>
  );
}
