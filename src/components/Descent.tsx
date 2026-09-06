"use client";

import { useEffect } from "react";

/**
 * The behaviour of the descent, done imperatively against the DOM.
 *
 * The rail readout changes on every frame of a scroll; putting that through
 * React state would re-render the page sixty times a second to move two numbers.
 * The markup is server-rendered, and this only mutates it.
 */

const GLYPHS = "01<>[]{}/\\|=+*·#$%&@_-";

function decode(node: HTMLElement, reduced: boolean) {
  const lang = document.documentElement.dataset.lang === "ru" ? "ru" : "en";
  const target = node.dataset[lang] ?? node.dataset.en ?? "";
  if (reduced) {
    node.textContent = target;
    return;
  }
  const chars = [...target];
  const start = chars.map(() => Math.floor(Math.random() * 12));
  const last = Math.max(...start, 0);
  let frame = 0;

  const iv = window.setInterval(() => {
    node.textContent = chars
      .map((ch, i) => {
        if (ch === " ") return " ";
        if (frame > start[i] + 6) return ch;
        if (frame < start[i]) return "";
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");
    if (frame++ > last + 8) {
      window.clearInterval(iv);
      node.textContent = target;
    }
  }, 34);

  const prev = Number(node.dataset.iv);
  if (prev) window.clearInterval(prev);
  node.dataset.iv = String(iv);
}

export function Descent() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-layer]")];
    const ground = document.getElementById("ground")!;
    const gauge = document.getElementById("gauge")!;
    const rDepth = document.getElementById("rDepth")!;
    const rCtx = document.getElementById("rCtx")!;
    const cold = document.querySelector<HTMLElement>("#cold h1");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("seen");
          for (const n of e.target.querySelectorAll<HTMLElement>("[data-decode]")) {
            decode(n, reduced);
          }
        }
      },
      // A ratio threshold is a trap here: it measures the visible fraction of the
      // *section*, so a layer taller than the viewport can never reach it and
      // would stay hidden for good. Fire on any overlap with a band across the
      // middle of the screen instead, which holds at any section height.
      { threshold: 0, rootMargin: "-30% 0px -30% 0px" },
    );
    for (const s of sections) io.observe(s);

    let shown = 0;
    let target = 0;
    let lit = 0;
    let raf = 0;

    function readScroll() {
      const h = document.body.scrollHeight - innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
      gauge.style.setProperty("--p", p.toFixed(3));

      let cur: HTMLElement | null = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top < innerHeight * 0.55) cur = s;
      }
      const ru = root.dataset.lang === "ru";
      rDepth.textContent = cur
        ? (cur.dataset[ru ? "depthRu" : "depthEn"] ?? "")
        : ru
          ? "поверхность"
          : "surface";
      target = cur ? Number(cur.dataset.facts) : 0;
      return p;
    }

    function frame() {
      const p = readScroll();
      lit += (p - lit) * 0.12;
      ground.style.setProperty("--lit", lit.toFixed(3));
      if (shown !== target) shown += Math.sign(target - shown);
      rCtx.textContent = String(root.dataset.ctx === "off" ? 0 : shown);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // The cold open resolves on its own, before anything is scrolled.
    let cursorTimer = 0;
    const openTimer = window.setTimeout(() => {
      if (!cold) return;
      decode(cold, reduced);
      cursorTimer = window.setTimeout(() => {
        cold.insertAdjacentHTML("beforeend", '<span class="cursor"></span>');
      }, 1400);
    }, 500);

    // Language changes have to re-run every decode that is already on screen.
    const mo = new MutationObserver(() => {
      readScroll();
      for (const n of document.querySelectorAll<HTMLElement>("[data-decode]")) {
        const sec = n.closest("section");
        if (sec?.id === "cold" || sec?.classList.contains("seen")) decode(n, reduced);
      }
    });
    mo.observe(root, { attributeFilter: ["data-lang"] });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(openTimer);
      clearTimeout(cursorTimer);
    };
  }, []);

  return null;
}
