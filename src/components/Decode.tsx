import type { TX } from "@/lib/tx";

/**
 * A heading that resolves out of noise when its layer arrives.
 *
 * The English text is rendered server-side so the page still reads with
 * JavaScript off and so the words are in the served HTML; the decode swaps it
 * for the active language once the layer is on screen.
 */
export function Decode({
  v,
  as: Tag = "h2",
  className,
}: {
  v: TX;
  as?: "h1" | "h2" | "p";
  className?: string;
}) {
  return (
    <Tag className={className} data-decode data-en={v.en} data-ru={v.ru}>
      {v.en}
    </Tag>
  );
}
