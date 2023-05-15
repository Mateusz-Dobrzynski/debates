"use client";
import { DebateClock } from "@/components/DebateClock";
import { DebateContext } from "@/contexts/DebateContext";
import { useLang } from "@/lib/useLang";
import Link from "next/link";
import { useContext, useState } from "react";

export default function PageDebate() {
  const debate = useContext(DebateContext);

  const [stage, setStage] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [advocem, setAdvocem] = useState<boolean>(false);

  const dot = `
    h-3 w-3 rounded-full border-2 border-zinc-500
  `;
  const dotfill = "bg-zinc-500";
  const dotactive = "border-zinc-400";
  const button = `
    bg-zinc-700 p-2 rounded hover:bg-zinc-600 border border-transparent
    hover:border-zinc-400
    disabled:cursor-not-allowed disabled:opacity-30 disabled:border-transparent
  `;

  const stageText = useLang(
    stage == 0
      ? "STAGE_0"
      : stage == 1
      ? "STAGE_1"
      : stage == 2
      ? "STAGE_2"
      : stage == 3
      ? "STAGE_3"
      : stage == 4
      ? "STAGE_4"
      : stage == 5
      ? "STAGE_5"
      : stage == 6
      ? "STAGE_6"
      : stage == 7
      ? "STAGE_7"
      : "STAGE_8"
  );
  const stageBtnText = useLang(
    stage == 0 && !running
      ? "STAGE_0_0_BTN"
      : stage == 0 && running && !advocem
      ? "STAGE_0_1_BTN"
      : stage == 1 && !running
      ? "STAGE_1_0_BTN"
      : stage == 1 && running && !advocem
      ? "STAGE_1_1_BTN"
      : stage == 2 && !running
      ? "STAGE_2_0_BTN"
      : stage == 2 && running && !advocem
      ? "STAGE_2_1_BTN"
      : stage == 3 && !running
      ? "STAGE_3_0_BTN"
      : stage == 3 && running && !advocem
      ? "STAGE_3_1_BTN"
      : stage == 4 && !running
      ? "STAGE_4_0_BTN"
      : stage == 4 && running && !advocem
      ? "STAGE_4_1_BTN"
      : stage == 5 && !running
      ? "STAGE_5_0_BTN"
      : stage == 5 && running && !advocem
      ? "STAGE_5_1_BTN"
      : stage == 6 && !running
      ? "STAGE_6_0_BTN"
      : stage == 6 && running && !advocem
      ? "STAGE_6_1_BTN"
      : stage == 7 && !running
      ? "STAGE_7_0_BTN"
      : stage == 7 && running && !advocem
      ? "STAGE_7_1_BTN"
      : "STAGE_7_0_BTN"
  );

  const oxfordDebate = useLang("oxfordDebate");
  const asPro = useLang("asPro");
  const asOpp = useLang("asOpp");

  return (
    <>
      <div className="text-center py-8 pt-16">
        <h1 className="font-serif text-4xl">
          {debate?.data.motion || "No motion given."}
        </h1>
        <p className="text-zinc-400">{oxfordDebate}</p>
      </div>
      <div className="flex flex-row py-4">
        <div className="w-1/2">
          <h2 className="font-serif text-2xl text-center">
            {debate?.data.proTeam || "Anonymous Team"}
          </h2>
          <p className="text-zinc-400 text-center">{asPro}</p>
          <div className="flex flex-row gap-2 justify-center pt-1">
            <div
              className={`
                ${dot}
                ${stage > 0 ? dotfill : ""}
                ${stage === 0 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 2 ? dotfill : ""}
                ${stage === 2 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 4 ? dotfill : ""}
                ${stage === 4 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 6 ? dotfill : ""}
                ${stage === 6 ? dotactive : ""}
              `}
            />
          </div>
        </div>
        <div className="w-1/2">
          <h2 className="font-serif text-2xl text-center">
            {debate?.data.oppTeam || "Anonymous Team"}
          </h2>
          <p className="text-zinc-400 text-center">{asOpp}</p>
          <div className="flex flex-row gap-2 justify-center pt-1">
            <div
              className={`
                ${dot}
                ${stage > 1 ? dotfill : ""}
                ${stage === 1 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 3 ? dotfill : ""}
                ${stage === 3 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 5 ? dotfill : ""}
                ${stage === 5 ? dotactive : ""}
              `}
            />
            <div
              className={`
                ${dot}
                ${stage > 7 ? dotfill : ""}
                ${stage === 7 ? dotactive : ""}
              `}
            />
          </div>
        </div>
      </div>
      <p className="text-center text-zinc-400">
        {advocem ? "AD VOCEM" : stageText}
      </p>
      <div className="flex flex-row py-4">
        {!advocem ? (
          <>
            <div className="w-1/2 flex flex-row justify-center">
              <DebateClock
                running={running && !advocem && [0, 2, 4, 6].includes(stage)}
                dimmed={running && [1, 3, 5, 7].includes(stage)}
              />
            </div>
            <div className="w-1/2 flex flex-row justify-center">
              <DebateClock
                running={running && !advocem && [1, 3, 5, 7].includes(stage)}
                dimmed={running && [0, 2, 4, 6].includes(stage)}
              />
            </div>
          </>
        ) : (
          <div className="w-full flex flex-row justify-center">
            <DebateClock running={advocem} adVocemClock />
          </div>
        )}
      </div>
      <div className={stage == 8 ? "hidden" : ""}>
        <div className="max-w-md mx-auto flex flex-row justify-center gap-2 pt-32">
          <button
            className={button}
            onClick={() => {
              if (stage == 8) return;
              if (running) {
                setRunning(false);
                setStage(stage + 1);
              } else {
                setRunning(true);
              }
            }}
            disabled={advocem}
          >
            {stageBtnText}
          </button>
          {debate?.data.adVocemTime ? (
            <button
              className={button}
              disabled={running && !advocem}
              onClick={() => {
                setAdvocem(!advocem);
              }}
            >
              Ad Vocem
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        className={`max-w-lg mx-auto flex flex-row justify-center gap-2 py-6 pt-32 ${
          stage == 8 ? "" : "hidden"
        }`}
      >
        <Link href="/" tabIndex={-1}>
          <button className={button}>Back to menu</button>
        </Link>
        <Link href="/debate/setup" tabIndex={-1}>
          <button className={button}>Back to debate config</button>
        </Link>
      </div>
    </>
  );
}
