"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useIsPresent, usePresenceData, useReducedMotion } from "framer-motion";
import { ActivityTransition, ACTIVITY_DURATION, type ActivityKind } from "./ActivityTransition";

export function GameOverlay({ children, label, kind, onClose, inputLocked = false, title, returnFocus }: {
  children: ReactNode;
  label: string;
  kind: "realm" | "battle" | "assessment" | "capital" | "panel" | "profile" | "quest" | "reward" | "events";
  onClose: () => void;
  inputLocked?: boolean;
  title?: string;
  returnFocus?: RefObject<HTMLElement | null>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const previousFocus = useRef(typeof document === "undefined" ? null : document.activeElement as HTMLElement | null);
  const close = useRef(onClose);
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const destination = usePresenceData();
  const activity = kind === "battle" || kind === "assessment" || kind === "events";
  const [introComplete, setIntroComplete] = useState(!activity);
  const [ready, setReady] = useState(false);
  const showIntro = activity && !reduced && !introComplete;
  const realm = kind === "realm" || kind === "capital";
  const duration = reduced ? .08 : kind === "quest" ? .65 : realm || activity ? .55 : .36;
  const offset = kind === "profile" ? { x: 45 } : kind === "battle" ? { y: 25, scale: 1.035 } : kind === "reward" ? { y: 20, scale: .94 } : kind === "events" ? { x: -32 } : realm ? { scale: 1.025 } : { y: 14 };
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!activity || reduced) return;
    const timer = window.setTimeout(() => setIntroComplete(true), ACTIVITY_DURATION[kind as ActivityKind]);
    return () => window.clearTimeout(timer);
  }, [activity, kind, reduced]);

  useEffect(() => {
    const previous = returnFocus?.current ?? previousFocus.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(root.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
      ) ?? []).filter(element => element.getClientRects().length && !element.closest('[inert], [aria-hidden="true"]'));
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [returnFocus]);

  return (
    <motion.div ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}
      className={`game-overlay game-overlay--${kind}`} data-phase={present ? "enter" : "exit"}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? .08 : .25, delay: present ? 0 : duration * .65 }}>
      <motion.div className="game-overlay__content" inert={inputLocked || showIntro || !present || !ready}
        onAnimationComplete={() => { if (present) setReady(true); }}
        initial={reduced || kind === "quest" ? { opacity: 1 } : { opacity: 0, ...offset }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={reduced || kind === "quest" ? { opacity: 1 } : { opacity: 0, ...offset }}
        transition={{ duration, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
      {!reduced && activity && (showIntro || !present) && <ActivityTransition key={present ? "entry" : "exit"} kind={kind as ActivityKind} title={title} closing={!present} />}
      {!reduced && realm && destination !== "battle" && <div className="realm-return-clouds" aria-hidden="true" />}
    </motion.div>
  );
}
