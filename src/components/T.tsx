import type { TX } from "@/lib/tx";

/**
 * Renders both languages and lets CSS show one. Keeping both in the document
 * means the language switch cannot flash, cannot desync during hydration, and
 * both versions are in the served HTML.
 *
 * `html` is enabled for copy that carries inline <b> emphasis; the content is
 * authored in this repository, never user input.
 */
export function T({ v, html = false }: { v: TX; html?: boolean }) {
  if (html) {
    return (
      <>
        <span data-t="en" dangerouslySetInnerHTML={{ __html: v.en }} />
        <span data-t="ru" dangerouslySetInnerHTML={{ __html: v.ru }} />
      </>
    );
  }
  return (
    <>
      <span data-t="en">{v.en}</span>
      <span data-t="ru">{v.ru}</span>
    </>
  );
}
