"use client";

import { BookOpenCheck, Swords } from "lucide-react";

export type ActivityKind = "battle" | "assessment" | "events";
export const ACTIVITY_DURATION: Record<ActivityKind, number> = { battle: 1050, assessment: 900, events: 1050 };

export function ActivityTransition({ kind, title, closing }: { kind: ActivityKind; title?: string; closing: boolean }) {
  const assessment = kind === "assessment";
  return <div className={`activity-transition activity-transition--${assessment ? "assessment" : "war"}`}
    data-direction={closing ? "exit" : "enter"} aria-hidden="true">
    {assessment ? <div className="assessment-parchment"><span className="assessment-seal"><BookOpenCheck /></span></div> : <>
      <div className="war-gate war-gate--left"><span className="war-banner" /></div>
      <div className="war-gate war-gate--right"><span className="war-banner" /></div>
      <div className="war-strike" />
    </>}
    <div className="activity-transition__title">{assessment ? <BookOpenCheck /> : <Swords />}
      <h2>{closing ? assessment ? "The record is sealed" : "Stand down" : assessment ? `${title} proving grounds` : kind === "events" ? "The war council assembles" : `The battle for ${title}`}</h2>
      <p>{closing ? "Your campaign continues." : assessment ? "Read carefully. Let precision be your mark." : "Raise your standard. Knowledge is your strongest weapon."}</p>
    </div>
  </div>;
}
