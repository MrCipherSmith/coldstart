import type { TX } from "@/lib/tx";

/**
 * Inline diagrams for the layers that have no screenshot to show.
 *
 * SVG rather than an image: it inherits the theme through the same custom
 * properties as everything else, stays sharp at any size, and costs nothing to
 * load. Each one argues the layer's point rather than decorating it.
 */

export type IllustrationKind = "vectors" | "twice" | "switches";

/** A fixed pseudo-scatter — a real random cloud would move between builds. */
const CLOUD = [
  [96, 82], [138, 58], [172, 104], [124, 128], [206, 74], [78, 132], [162, 152],
  [232, 122], [110, 176], [196, 188], [148, 208], [252, 168], [86, 218],
  [214, 232], [178, 258], [128, 254], [244, 214], [62, 178], [104, 108],
  [188, 130], [222, 96], [142, 96], [166, 200], [206, 152], [118, 148],
  [92, 158], [236, 146], [156, 124], [130, 190], [176, 172],
];
/** The three the query actually reaches. */
const HITS = [[156, 124], [176, 172], [142, 96]];

function Vectors() {
  return (
    <svg viewBox="0 0 600 330" role="img" aria-labelledby="vec-t">
      <title id="vec-t">
        A query reaching its three nearest documents while the answer it needed
        sits outside the index entirely
      </title>

      <text className="lab" x="8" y="16">indexed documentation</text>
      <ellipse className="field" cx="160" cy="168" rx="130" ry="118" />

      {CLOUD.map(([x, y]) => (
        <circle key={`${x}-${y}`} className="dot" cx={x} cy={y} r="3" />
      ))}

      <circle className="reach" cx="158" cy="140" r="52" />
      {HITS.map(([x, y]) => (
        <circle key={`h${x}-${y}`} className="hit" cx={x} cy={y} r="4.5" />
      ))}
      <circle className="query" cx="158" cy="140" r="6" />
      <text className="lab accent" x="158" y="120" textAnchor="middle">query</text>
      <text className="lab" x="158" y="206" textAnchor="middle">3 nearest · 0.89</text>

      <path className="miss" d="M296 168 H392" />
      <circle className="outside" cx="412" cy="168" r="7" />
      <text className="lab warn" x="432" y="152">the convention</text>
      <text className="lab warn" x="432" y="168">of this repo</text>
      <text className="lab" x="432" y="192">never indexed.</text>
      <text className="lab" x="432" y="208">never retrieved.</text>
      <text className="lab" x="432" y="224">the thing it</text>
      <text className="lab" x="432" y="240">got wrong.</text>
    </svg>
  );
}

const STACK = ["MCP server", "async indexer", "pgvector", "Postgres"];

function Twice() {
  const col = (x: number, head: string, tone: "a" | "b") => (
    <g>
      <rect className={`head ${tone}`} x={x} y="34" width="180" height="46" rx="6" />
      <text className={`lab ${tone === "a" ? "accent" : "warn"}`} x={x + 90} y="62" textAnchor="middle">
        {head}
      </text>
      {STACK.map((row, i) => (
        <g key={row}>
          <rect className="box" x={x} y={94 + i * 44} width="180" height="34" rx="5" />
          <text className="lab" x={x + 90} y={115 + i * 44} textAnchor="middle">{row}</text>
        </g>
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 560 330" role="img" aria-labelledby="tw-t">
      <title id="tw-t">
        Two identical stacks, fourteen months apart, differing only in the top box
      </title>
      <text className="lab" x="90" y="20" textAnchor="middle">nov 2025</text>
      <text className="lab" x="330" y="20" textAnchor="middle">jan 2026</text>
      {col(0, "documentation", "a")}
      {col(240, "standards", "b")}

      <path className="tie" d="M186 111 H234" />
      <path className="tie" d="M186 155 H234" />
      <path className="tie" d="M186 199 H234" />
      <path className="tie" d="M186 243 H234" />

      <path className="brace" d="M0 286 V300 H420 V286" />
      <text className="lab" x="210" y="320" textAnchor="middle">
        identical below the first box
      </text>
      <text className="lab warn" x="470" y="176">built</text>
      <text className="lab warn" x="470" y="192">twice to</text>
      <text className="lab warn" x="470" y="208">be sure</text>
    </svg>
  );
}

const OFF = [
  { k: "shared work context", n: "sac" },
  { k: "vendor CLI as a child agent", n: "external agents" },
  { k: "remote entry over HTTP", n: "keryx serve" },
  { k: "read-only tool server", n: "mcp" },
];

function Switches() {
  return (
    <svg viewBox="0 0 560 330" role="img" aria-labelledby="sw-t">
      <title id="sw-t">Four capabilities, each shipped in the off position</title>
      <text className="lab" x="8" y="18">nine modules are on after init. these four are not.</text>

      {OFF.map((row, i) => {
        const y = 52 + i * 62;
        return (
          <g key={row.n}>
            <rect className="box" x="0" y={y} width="560" height="46" rx="6" />
            <text className="val" x="20" y={y + 22}>{row.k}</text>
            <text className="lab" x="20" y={y + 38}>{row.n}</text>
            <rect className="track" x="466" y={y + 12} width="70" height="22" rx="11" />
            <circle className="knob" cx="478" cy={y + 23} r="8" />
            <text className="lab" x="500" y={y + 27}>off</text>
          </g>
        );
      })}
    </svg>
  );
}


const KINDS = { vectors: Vectors, twice: Twice, switches: Switches };

export function Illustration({ kind, caption }: { kind: IllustrationKind; caption: TX }) {
  const Body = KINDS[kind];
  return (
    <div className="shots">
      <figure className="shot diagram">
        <Body />
        <figcaption>
          <span data-t="en" dangerouslySetInnerHTML={{ __html: caption.en }} />
          <span data-t="ru" dangerouslySetInnerHTML={{ __html: caption.ru }} />
        </figcaption>
      </figure>
    </div>
  );
}
