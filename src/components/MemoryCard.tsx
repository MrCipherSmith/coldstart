"use client";

import { useEffect, useState } from "react";
import { useChrome } from "@/lib/chrome";

const KEY = "coldstart.visits";

/**
 * The one claim on the page that proves itself: the agent forgets you on every
 * reload, and this does not. Stored per browser, never sent anywhere.
 */
export function MemoryCard() {
  const { lang } = useChrome();
  const [visits, setVisits] = useState<number[] | null>(null);

  useEffect(() => {
    let log: number[] = [];
    try {
      log = JSON.parse(localStorage.getItem(KEY) || "[]");
      log.push(Date.now());
      localStorage.setItem(KEY, JSON.stringify(log.slice(-20)));
    } catch {
      /* storage blocked — the page simply has no memory here, which is the joke */
    }
    setVisits(log);
  }, []);

  let text: string;
  if (visits === null) {
    text = lang === "ru" ? "Читаю память…" : "Reading memory…";
  } else if (visits.length <= 1) {
    text =
      lang === "ru"
        ? "Это твой первый заход. Страница только что записала его. Вернись завтра — агент тебя не вспомнит, а память вспомнит."
        : "This is your first visit. The page just wrote it down. Come back tomorrow — the agent will not remember you. The memory will.";
  } else {
    const prev = new Date(visits[visits.length - 2]);
    const days = Math.max(0, Math.round((Date.now() - prev.getTime()) / 864e5));
    text =
      lang === "ru"
        ? `Ты был здесь ${visits.length - 1} раз(а). Последний — ${
            days === 0 ? "сегодня" : `${days} дн. назад`
          }, ${prev.toLocaleString("ru")}. Агент об этом не знает. Память знает.`
        : `You have been here ${visits.length - 1} time(s). Last one ${
            days === 0 ? "today" : `${days} day(s) ago`
          }, ${prev.toLocaleString("en")}. The agent does not know this. The memory does.`;
  }

  return (
    <div className="memo">
      <div className="k">
        {lang === "ru" ? "эта страница тебя помнит" : "this page remembers you"}
      </div>
      <p>{text}</p>
    </div>
  );
}
