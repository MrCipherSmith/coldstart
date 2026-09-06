"use client";

import { useSyncExternalStore } from "react";

/**
 * Interface state — language, theme, and whether the page is pretending to have
 * no context. All three live as attributes on <html> so CSS can drive most of
 * the page without React re-rendering, and so the inline boot script in the
 * layout can restore them before first paint.
 */

export type Lang = "en" | "ru";
export type Theme = "dark" | "light";
export type Ctx = "on" | "off";

export type ChromeState = { lang: Lang; theme: Theme; ctx: Ctx };

const DEFAULTS: ChromeState = { lang: "en", theme: "dark", ctx: "on" };
export const STORAGE_KEY = "coldstart.chrome";

const listeners = new Set<() => void>();
let snapshot: ChromeState = DEFAULTS;

function read(): ChromeState {
  if (typeof document === "undefined") return DEFAULTS;
  const d = document.documentElement.dataset;
  return {
    lang: (d.lang as Lang) ?? DEFAULTS.lang,
    theme: (d.theme as Theme) ?? DEFAULTS.theme,
    ctx: (d.ctx as Ctx) ?? DEFAULTS.ctx,
  };
}

function sync() {
  const next = read();
  if (
    next.lang !== snapshot.lang ||
    next.theme !== snapshot.theme ||
    next.ctx !== snapshot.ctx
  ) {
    snapshot = next;
    for (const l of listeners) l();
  }
}

export function set<K extends keyof ChromeState>(key: K, value: ChromeState[K]) {
  const root = document.documentElement;
  root.dataset[key] = value;
  if (key === "lang") root.lang = value;
  sync();
  // `ctx` is a demonstration, not a preference — it always starts back on.
  if (key === "ctx") return;
  try {
    const stored = { ...snapshot };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang: stored.lang, theme: stored.theme }),
    );
  } catch {
    /* private mode, blocked storage — the choice just does not persist */
  }
}

export function useChrome(): ChromeState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => DEFAULTS,
  );
}

/** Call once on mount so the store matches whatever the boot script restored. */
export function adopt() {
  snapshot = read();
  for (const l of listeners) l();
}

/** The boot script, stringified into the document head. Runs before first paint. */
export const BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||'{}');
var t=s.theme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
d.dataset.theme=t;
if(s.lang){d.dataset.lang=s.lang;d.lang=s.lang;}
d.dataset.ctx='on';
}catch(e){}})();`;
