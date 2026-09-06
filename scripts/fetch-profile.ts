/**
 * Builds data/profile.json from public sources: GitHub REST + the npm registry.
 *
 * Every number rendered on the site comes from this file, and this file comes
 * only from here. Run it, commit the diff — the snapshot is versioned so a
 * build is reproducible and works offline.
 *
 *   bun run scripts/fetch-profile.ts
 *
 * GITHUB_TOKEN is optional but avoids the 60 req/h anonymous rate limit.
 */

const LOGIN = "MrCipherSmith";
/**
 * This site's own repository. Counting it would feed a loop: the nightly job
 * commits here, which moves the count, which makes the next night commit again,
 * for a number the page never shows.
 */
const SELF = "coldstart";
const NPM_PACKAGES = ["@mrciphersmith/keryx"];
const OUT = new URL("../data/profile.json", import.meta.url);

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": `${LOGIN}-profile-builder`,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

/** Commit count without paging every commit: ask for 1 per page, read `last`. */
async function commitCount(repo: string): Promise<number> {
  const res = await fetch(
    `https://api.github.com/repos/${LOGIN}/${repo}/commits?per_page=1`,
    {
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": `${LOGIN}-profile-builder`,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  if (!res.ok) return 0;
  const link = res.headers.get("link");
  const last = link?.match(/[?&]page=(\d+)>;\s*rel="last"/)?.[1];
  if (last) return Number(last);
  return ((await res.json()) as unknown[]).length;
}

async function releaseCount(repo: string): Promise<number> {
  const res = await fetch(
    `https://api.github.com/repos/${LOGIN}/${repo}/tags?per_page=1`,
    {
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": `${LOGIN}-profile-builder`,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  if (!res.ok) return 0;
  const last = res.headers
    .get("link")
    ?.match(/[?&]page=(\d+)>;\s*rel="last"/)?.[1];
  if (last) return Number(last);
  return ((await res.json()) as unknown[]).length;
}

type GhRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  created_at: string;
  pushed_at: string;
  homepage: string | null;
  html_url: string;
  size: number;
};

async function main() {
  const user = await gh<Record<string, unknown>>(`users/${LOGIN}`);
  const rawRepos = await gh<GhRepo[]>(
    `users/${LOGIN}/repos?per_page=100&sort=updated`,
  );

  const repos = [];
  for (const r of rawRepos) {
    if (r.name === SELF) continue;
    const languages = r.fork
      ? {}
      : await gh<Record<string, number>>(`repos/${LOGIN}/${r.name}/languages`);
    repos.push({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      isFork: r.fork,
      archived: r.archived,
      topics: r.topics ?? [],
      createdAt: r.created_at,
      pushedAt: r.pushed_at,
      homepage: r.homepage || null,
      url: r.html_url,
      sizeKb: r.size,
      commits: r.fork ? 0 : await commitCount(r.name),
      releases: r.fork ? 0 : await releaseCount(r.name),
      languages,
    });
  }

  const npm = [];
  for (const pkg of NPM_PACKAGES) {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`);
    if (!res.ok) continue;
    const d = (await res.json()) as {
      "dist-tags": Record<string, string>;
      versions: Record<string, unknown>;
      time: Record<string, string>;
      description?: string;
    };
    const stamps = Object.entries(d.time)
      .filter(([k]) => k !== "created" && k !== "modified")
      .map(([, v]) => v)
      .sort();
    npm.push({
      name: pkg,
      description: d.description ?? null,
      latest: d["dist-tags"].latest,
      versions: Object.keys(d.versions).length,
      firstPublish: stamps[0] ?? d.time.created,
      lastPublish: stamps[stamps.length - 1] ?? d.time.modified,
    });
  }

  const own = repos.filter((r) => !r.isFork);
  const languages: Record<string, number> = {};
  for (const r of own) {
    for (const [lang, bytes] of Object.entries(r.languages)) {
      languages[lang] = (languages[lang] ?? 0) + bytes;
    }
  }

  const profile = {
    generatedAt: new Date().toISOString(),
    source: "github.com REST v3 + registry.npmjs.org",
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      url: user.html_url,
      createdAt: user.created_at,
      publicRepos: user.public_repos,
      followers: user.followers,
    },
    repos,
    npm,
    totals: {
      ownRepos: own.length,
      forks: repos.length - own.length,
      commits: own.reduce((n, r) => n + r.commits, 0),
      releases: own.reduce((n, r) => n + r.releases, 0),
      stars: own.reduce((n, r) => n + r.stars, 0),
      npmVersions: npm.reduce((n, p) => n + p.versions, 0),
      languages,
    },
  };

  // Only the timestamp changes on a run where nothing moved. Writing it anyway
  // would put a commit — and a rebuild — on the calendar every night for a date
  // nobody reads, so the snapshot is left alone unless a value actually differs.
  const next = JSON.stringify(profile, null, 2) + "\n";
  let previous = "";
  try {
    previous = await Bun.file(OUT).text();
  } catch {
    /* first run */
  }
  const strip = (text: string) => text.replace(/"generatedAt": "[^"]*",\n\s*/, "");
  if (previous && strip(previous) === strip(next)) {
    console.log("profile unchanged, nothing written");
    return;
  }

  await Bun.write(OUT, next);
  console.log(
    `wrote data/profile.json — ${own.length} own repos, ` +
      `${profile.totals.commits} commits, ${profile.totals.releases} releases`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
