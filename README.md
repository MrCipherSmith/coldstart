# coldstart

The site at [mrciphersmith.com](https://mrciphersmith.com).

An agent opens a repository and knows nothing about it. The page is a descent
through five answers to that, each one a layer deeper — documentation, then
standards, then procedure, then a control plane, and finally the repository
itself. Scrolling goes *down*: the ground brightens, the fact counter climbs,
and headings resolve out of noise as each layer arrives.

There is a switch in the corner marked **context: off**. It drains the whole
page back to the dark, because that is what every agent sees in every repository
on every task.

## The figures are not typed in

Copy carries `{{token}}` placeholders instead of numbers, filled at build time
from two committed snapshots — `data/profile.json` (GitHub and npm counters) and
`data/dashboard.json` (the keryx dashboard header). Both sit next to the code, so
a build is reproducible offline and no claim on the page can drift away from its
source.

The dashboard screenshot is the case that made this worth doing: its caption used
to carry hand-typed numbers, and they were wrong within weeks. Picture and
caption now come out of one render of one page.

```bash
bun run data     # refresh data/profile.json from the APIs
bun run shots    # crop and convert screenshots into public/shots
bun run shot:dash <path-to-keryx-dashboard.html>   # re-shoot the dashboard
bun run dev      # local
bun run build    # static export into out/
```

A nightly GitHub Action re-runs the fetch and commits the snapshot only when a
value actually changed. That commit is what triggers the next deploy.

## Built with

Next.js 15 static export, TypeScript, Bun. No component library and no CSS
framework doing the work: the design is one hand-written stylesheet, a scroll,
and three inline SVG diagrams that inherit the same custom properties as
everything else, so light and dark cost one file rather than two.

Deployment lives in [DEPLOY.md](DEPLOY.md).
