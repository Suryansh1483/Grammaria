"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Territory } from "@/types/game";

export function AtlasTransition({ territory, onCovered, onComplete, onCancel }: {
  territory: Territory;
  onCovered: (territory: Territory) => void;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const cover = window.setTimeout(() => onCovered(territory), reduced ? 0 : 520);
    const complete = window.setTimeout(onComplete, reduced ? 30 : 1250);
    const preventInput = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    document.addEventListener("keydown", preventInput, true);
    return () => {
      window.clearTimeout(cover);
      window.clearTimeout(complete);
      document.removeEventListener("keydown", preventInput, true);
    };
  }, [territory, reduced, onCovered, onComplete, onCancel]);

  return <div className={`atlas-crossing atlas-crossing--${territory.id === "centralia" ? "capital" : territory.id === "temporalia" ? "time" : "gold"}`} role="status">
    <span className="sr-only">Entering {territory.name}. Press Escape to return to the atlas.</span>
    {!reduced && <>
      <motion.div className="atlas-crossing__shade" initial={{ opacity: 0 }} animate={{ opacity: [0, .85, .85, 0] }} transition={{ duration: 1.25, times: [0, .35, .55, 1] }} />
      <div className="atlas-crossing__cloud atlas-crossing__cloud--near" />
      <div className="atlas-crossing__cloud atlas-crossing__cloud--far" />
      <div className="atlas-crossing__cloud atlas-crossing__cloud--low" />
    </>}
  </div>;
}
