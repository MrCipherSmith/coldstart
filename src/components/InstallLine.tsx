"use client";

import { useState } from "react";
import { useChrome } from "@/lib/chrome";

const CMD = "npm install -g @mrciphersmith/keryx";

export function InstallLine() {
  const { lang } = useChrome();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard denied — the command is right there to select by hand */
    }
  }

  return (
    <div className="install">
      <span className="p">$</span>
      <code>{CMD}</code>
      <button onClick={copy}>
        {copied
          ? lang === "ru"
            ? "скопировано"
            : "copied"
          : lang === "ru"
            ? "копировать"
            : "copy"}
      </button>
    </div>
  );
}
