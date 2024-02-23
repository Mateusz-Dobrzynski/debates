"use client";
import { motion, motionTypes } from "@/types/motion";
import motions from "@/data/motion.json";
import { useContext, useEffect, useState } from "react";
import { IconInfo } from "@/components/icons/info";
import { getSpecificLangString, useLang } from "@/lib/useLang";
import { GenericButton } from "./GenericButton";
import { DebateContext } from "@/contexts/DebateContext";
import { IconDice } from "./icons/Dice";
import { IconClock } from "./icons/Clock";
import { useRouter } from "next/navigation";
import { langsArray, langsPublicBlacklist, language } from "@/types/language";
import { Checkbox } from "./Checkbox";

/**
 * TO-DO:
 * Fix errors
 * Componentize as much as possible
 * Prevent languages with no motions from being displayed in filter
 * Polish the filter component style
 */

const MotionGenerator = () => {
  const [motion, setMotion] = useState<motion | null>(null);
  const infoslideString = useLang("infoslide");
  const debateContext = useContext(DebateContext);
  const router = useRouter();

  function generateMotion(): motion {
    console.log(motions);
    const filteredMotions = motions.filter((motion) => {
      return (
        motion.type &&
        enabledLanguages.includes(motion.lang) &&
        enabledMotions.includes(motion.type as any)
      );
    });
    console.log(filteredMotions);
    return filteredMotions[Math.floor(Math.random() * filteredMotions.length)];
  }

  function saveMotionToContext(): void {
    debateContext.setConf({
      ...debateContext.conf,
      motion: motion?.motion || "",
    });
  }

  /** Calls the {@link generateMotion()} on page load. */
  useEffect(() => {
    setMotion(generateMotion());
  }, []);

  const allowedMotionLanguages = [
    ...langsArray
      .filter((lang) => !langsPublicBlacklist.includes(lang))
      .map((lang) => {
        return lang;
      }),
  ];

  const [enabledLanguages, setEnabledLanguages] = useState(
    allowedMotionLanguages.map((lang) => {
      return lang.toString();
    })
  );

  const getMotionTypesStrings = () => {
    return motionTypes.map((motionType) => {
      return motionType.type;
    });
  };

  const [enabledMotions, setEnabledMotions] = useState(getMotionTypesStrings());

  const applyLanguageFilter = (event: any) => {
    const checkedLanguage: string = event.target.value;
    if (event.target.checked) {
      if (enabledLanguages.length == allowedMotionLanguages.length) {
        setEnabledLanguages([checkedLanguage]);
      } else {
        setEnabledLanguages([...enabledLanguages, checkedLanguage]);
      }
    } else {
      if (enabledLanguages.length == 1) {
        setEnabledLanguages(allowedMotionLanguages);
      } else {
        setEnabledLanguages(
          enabledLanguages.filter((entry) => {
            return entry != checkedLanguage;
          })
        );
      }
    }
  };

  const applyMotionTypeFilter = (event: any) => {
    const checkedMotionType = event.target.value;
    if (event.target.checked) {
      if (enabledMotions.length == motionTypes.length) {
        setEnabledMotions([checkedMotionType]);
      } else {
        setEnabledMotions([...enabledMotions, checkedMotionType]);
      }
    } else {
      if (enabledMotions.length == 1) {
        setEnabledMotions(getMotionTypesStrings());
      } else {
        setEnabledMotions(
          enabledMotions.filter((entry) => {
            return entry != checkedMotionType;
          })
        );
      }
    }
  };

  function isLanguageDisabled(motionLanguage: language): boolean {
    if (enabledLanguages.includes(motionLanguage)) {
      return false;
    }
    return true;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <section className="flex flex-col space-y-2 max-w-[400px]">
        <GenericButton
          text={useLang("debateMotionGeneratorRegenerate")}
          icon={IconDice}
          onClick={() => setMotion(generateMotion())}
        />
        <GenericButton
          text={useLang("debateOverThisMotion")}
          icon={IconClock}
          onClick={() => {
            saveMotionToContext();
            router.push("/oxford-debate/setup");
          }}
        />
      </section>{" "}
      <div className="bg-zinc-800 p-3">
        <h5 className="text-center font-bold">{useLang("motionFilterTitle")}</h5>
        <section className="flex flex-col">
          <h6 className="text-center">{useLang("language")}</h6>
          {allowedMotionLanguages.map((langCode) => (
            <label className="flex flex-row justify-between">
              <span>{getSpecificLangString("selfLanguageString", langCode)}</span>
              <input
                type="checkbox"
                name="language"
                value={langCode}
                onChange={applyLanguageFilter}
              />
            </label>
          ))}
        </section>
        <section>
          <h6 className="text-center">{useLang("motionType")}</h6>
          {motionTypes.map((motionType) => (
            <Checkbox
              name="motionType"
              value={motionType.type}
              labelText={useLang(motionType.type)}
              disabled={isLanguageDisabled(motionType.lang)}
              onChange={applyMotionTypeFilter}
            />
          ))}
        </section>
        <GenericButton
          text={useLang("filterButtonText")}
          onClick={() => {
            if (
              motion?.type &&
              motion?.lang &&
              !(
                enabledMotions.includes(motion?.type as any) &&
                enabledLanguages.includes(motion?.lang)
              )
            )
              setMotion(generateMotion());
          }}
        />
      </div>
      <section className="p-5">
        {motion && motion.adinfo ? (
          <section className="flex flex-col items-center mb-5">
            <section className="flex gap-2 text-2xl items-center">
              <span className="text-neutral-500">
                <IconInfo />
              </span>
              {infoslideString}
            </section>
            <p className="text-justify max-w-[75vw]">{motion.adinfo}</p>
          </section>
        ) : (
          ""
        )}
        <p className="text-2xl md:text-2xl max-w-[85vw] mb-5">
          &quot;{motion?.motion || ""}&quot;
        </p>
        <p className="text-neutral-500 flex flex-col">
          {"[Insert motion type here]"}
          <br />
          {motion?.source || ""}
        </p>
      </section>
    </div>
  );
};

export { MotionGenerator };
