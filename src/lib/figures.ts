import profile from "@data/profile.json";
import type { TX } from "@/lib/tx";

/**
 * Every figure the page states about these repositories is read from
 * data/profile.json, which comes only from the GitHub and npm APIs. Copy carries
 * `{{token}}` placeholders rather than typed-in numbers, so a claim on the page
 * cannot drift away from its source.
 */

type Repo = (typeof profile.repos)[number];

const repo = (name: string): Repo => {
  const found = profile.repos.find((r) => r.name === name);
  if (!found) throw new Error(`profile.json has no repository "${name}"`);
  return found;
};

const num = (n: number): TX => ({
  en: n.toLocaleString("en-US"),
  ru: n.toLocaleString("ru-RU"),
});

const plain = (s: string): TX => ({ en: s, ru: s });

const keryx = repo("keryx");
const helyx = repo("helyx");
const npm = profile.npm[0];

const DATE: TX = {
  en: new Date(profile.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  ru: new Date(profile.generatedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};

export const FIGURES: Record<string, TX> = {
  "keryx.commits": num(keryx.commits),
  "keryx.releases": num(keryx.releases),
  "helyx.commits": num(helyx.commits),
  "npm.versions": num(npm.versions),
  "npm.latest": plain(npm.latest),
  "totals.commits": num(profile.totals.commits),
  "read.on": DATE,
};

/** Replaces every `{{token}}` in both halves of a bilingual string. */
export function fill(v: TX): TX {
  const one = (text: string, lang: "en" | "ru") =>
    text.replace(/\{\{([\w.]+)\}\}/g, (whole, token: string) => {
      const figure = FIGURES[token];
      if (!figure) throw new Error(`unknown figure token: ${whole}`);
      return figure[lang];
    });
  return { en: one(v.en, "en"), ru: one(v.ru, "ru") };
}
