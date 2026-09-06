# Deploying mrciphersmith.com

The site is a static export — nothing runs on a server.

Every figure the page states about these repositories is a `{{token}}` in the
copy, filled at build time from two committed snapshots:

- `data/profile.json` — commits, tags and npm versions, from the GitHub and npm APIs.
- `data/dashboard.json` — the keryx dashboard header, read off the same render
  that produced `public/shots/dashboard.webp`, so the picture and its caption
  cannot disagree.

The nightly workflow refreshes both and commits **only when a value actually
moved**. The screenshot re-renders byte-differently every run, so committing it
unconditionally would rebuild the site every night for nothing.

## Hosting: Cloudflare Pages

The domain already uses Cloudflare nameservers (`becky`/`carl.ns.cloudflare.com`)
and the apex is proxied there, so the apex needs no DNS surgery — Pages attaches
to it directly. `helyx.mrciphersmith.com` is unaffected; it is a separate record.

1. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**,
   pick this repository.
2. Build settings:

   | Field | Value |
   |---|---|
   | Framework preset | None |
   | Build command | `bun install && bun run build` |
   | Build output directory | `out` |
   | Environment variable | `BUN_VERSION = 1.3.12` |

3. **Custom domains → Set up a custom domain → `mrciphersmith.com`.**
   Cloudflare writes the record itself because the zone is already in the account.
4. Add `www.mrciphersmith.com` as a second custom domain, or a bulk redirect
   `www → apex`. Either is fine; the redirect is tidier.

Every push to `main` publishes. Pull requests get their own preview URL.

## Keeping the numbers current

`.github/workflows/refresh-data.yml` runs nightly, re-fetches the snapshot and
commits it **only when a value actually changed**. That commit is what triggers
the next Pages build, so the page follows the real repositories without anyone
touching it.

Run it by hand any time from the Actions tab (`workflow_dispatch`), or locally:

```bash
GITHUB_TOKEN=$(gh auth token) bun run scripts/fetch-profile.ts
```

The token is optional — it only lifts the 60 requests/hour anonymous rate limit.

## If Cloudflare Pages is ever not wanted

GitHub Pages also works and is already in use for the keryx documentation site.
The cost is that an apex domain on GitHub Pages needs `A`/`AAAA` records pointing
at GitHub's IPs, which means taking the apex out from behind the Cloudflare proxy
— losing the edge cache and the analytics in front of it. Cloudflare Pages avoids
that trade entirely, which is why it is the recommendation.
