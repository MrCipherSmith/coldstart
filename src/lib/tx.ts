/** A string that exists in both interface languages. */
export type TX = { en: string; ru: string };

export const pick = (t: TX, lang: "en" | "ru") => t[lang];
