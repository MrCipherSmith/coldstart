"use client";

import { useEffect } from "react";
import { adopt, set, useChrome } from "@/lib/chrome";

export function Toolbar() {
  const { lang, theme, ctx } = useChrome();

  // The boot script set these before paint; take them over now.
  useEffect(adopt, []);

  return (
    <div className="bar">
      <button
        className="kill"
        onClick={() => set("ctx", ctx === "on" ? "off" : "on")}
        aria-pressed={ctx === "off"}
      >
        {lang === "ru"
          ? `контекст: ${ctx === "on" ? "вкл" : "выкл"}`
          : `context: ${ctx}`}
      </button>

      <div className="seg">
        {(["dark", "light"] as const).map((v) => (
          <button
            key={v}
            onClick={() => set("theme", v)}
            aria-pressed={theme === v}
            aria-label={v === "dark" ? "Dark theme" : "Light theme"}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="seg">
        {(["en", "ru"] as const).map((v) => (
          <button key={v} onClick={() => set("lang", v)} aria-pressed={lang === v}>
            {v.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
