import dashboard from "@data/dashboard.json";
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

const pkg = (name: string) => {
  const found = profile.npm.find((p) => p.name === name);
  if (!found) throw new Error(`profile.json has no npm package "${name}"`);
  return found;
};

const keryx = repo("keryx");
const helyx = repo("helyx");
const roomyx = repo("roomyx");
// By name, not by position: the list grew, and npm[0] would have kept
// working by accident right up until the order changed.
const npm = pkg("@mrciphersmith/keryx");
const roomyxNpm = pkg("@mrciphersmith/roomyx");

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

/** Read off the same render that produced public/shots/dashboard.webp. */
const SHOT_ON: TX = {
  en: new Date(dashboard.shotAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  ru: new Date(dashboard.shotAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};

export const FIGURES: Record<string, TX> = {
  "dash.health": num(dashboard.health),
  "dash.findings": num(dashboard.findings),
  "dash.graphFiles": num(dashboard.graphFiles),
  "dash.wikiPages": num(dashboard.wikiPages),
  "dash.memoryEntries": num(dashboard.memoryEntries),
  "dash.modules": num(dashboard.modules),
  "dash.shotOn": SHOT_ON,
  "keryx.commits": num(keryx.commits),
  "keryx.releases": num(keryx.releases),
  "helyx.commits": num(helyx.commits),
  "npm.versions": num(npm.versions),
  "npm.latest": plain(npm.latest),
  "roomyx.commits": num(roomyx.commits),
  "roomyx.versions": num(roomyxNpm.versions),
  "roomyx.latest": plain(roomyxNpm.latest),
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

export type Version = { value: string; source: "npm" | "release" };

/**
 * The version shown beside a project's name. npm when the package is
 * published there — that is what a person actually installs — otherwise the
 * latest GitHub release. Null when the project has neither, and then nothing is
 * shown rather than a guess.
 */
export function versionOf(project: string): Version | null {
  const found = profile.repos.find((r) => r.name === project) as
    | { version?: Version | null }
    | undefined;
  return found?.version ?? null;
}

