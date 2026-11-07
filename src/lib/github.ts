import { GitHubStats, GitHubCommitSample } from "@/types";

const CURSED_PATTERNS = [
  /^fix$/i,
  /^fixes$/i,
  /^fixed$/i,
  /^bug fix/i,
  /^update$/i,
  /^updates$/i,
  /^changes$/i,
  /^test$/i,
  /^testing$/i,
  /^wip$/i,
  /^asdf/i,
  /^commit$/i,
  /^cleanup$/i,
  /^refactor$/i,
  /^done$/i,
  /^final$/i,
  /^final final/i,
  /pls work/i,
  /please work/i,
  /why/i,
  /god help/i,
  /fuck/i,
  /shit/i,
  /kill me/i,
  /almost/i,
  /trying/i,
  /idk/i,
  /work/i,
  /lol/i,
  /oops/i,
  /typo/i,
  /formatting/i,
  /temp/i,
  /save/i,
  /savepoint/i,
  /delete/i,
  /deploy/i,
  /revert/i,
  /bump/i,
];

export async function fetchGitHubUserData(username: string): Promise<GitHubStats> {
  const cleanUsername = username.trim().replace(/^@/, '');
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitShame-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Fetch User Profile
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!userRes.ok) {
    if (userRes.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found. Did they delete their account in shame?`);
    }
    if (userRes.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. Please try again in a few minutes or add a GITHUB_TOKEN.`);
    }
    throw new Error(`Failed to fetch GitHub profile for "${cleanUsername}": ${userRes.statusText}`);
  }

  const user = await userRes.json();

  // 2. Fetch User Public Repos (up to 30 sorted by recently pushed)
  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=pushed&per_page=30`,
    { headers, next: { revalidate: 3600 } }
  );
  const repos = reposRes.ok ? await reposRes.json() : [];

  // 3. Fetch User Public Events (to extract actual commit messages and timestamps)
  const eventsRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=50`,
    { headers, next: { revalidate: 3600 } }
  );
  const events = eventsRes.ok ? await eventsRes.json() : [];

  // Parse commit samples from PushEvents
  const commits: GitHubCommitSample[] = [];
  if (Array.isArray(events)) {
    for (const ev of events) {
      if (ev.type === "PushEvent" && ev.payload && Array.isArray(ev.payload.commits)) {
        const repoName = ev.repo?.name ? ev.repo.name.split("/")[1] || ev.repo.name : "repo";
        const dateStr = ev.created_at || new Date().toISOString();
        const dateObj = new Date(dateStr);
        const hour = dateObj.getHours();
        const day = dateObj.getDay();
        const isWeekend = day === 0 || day === 6;

        for (const c of ev.payload.commits) {
          if (c.message) {
            commits.push({
              sha: (c.sha || "sha").slice(0, 7),
              message: c.message.trim().split("\n")[0], // first line of commit
              date: dateStr,
              repo: repoName,
              hour,
              isWeekend,
            });
          }
        }
      }
    }
  }

  // If public events had no commits, try fetching from their most recent repo directly
  if (commits.length === 0 && Array.isArray(repos) && repos.length > 0) {
    try {
      const topRepo = repos[0];
      const repoCommitsRes = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(topRepo.name)}/commits?per_page=10`,
        { headers, next: { revalidate: 3600 } }
      );
      if (repoCommitsRes.ok) {
        const repoCommits = await repoCommitsRes.json();
        if (Array.isArray(repoCommits)) {
          for (const item of repoCommits) {
            const msg = item.commit?.message?.trim()?.split("\n")[0] || "";
            const dateStr = item.commit?.author?.date || new Date().toISOString();
            const dateObj = new Date(dateStr);
            if (msg) {
              commits.push({
                sha: (item.sha || "").slice(0, 7),
                message: msg,
                date: dateStr,
                repo: topRepo.name,
                hour: dateObj.getHours(),
                isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6,
              });
            }
          }
        }
      }
    } catch (e) {
      // ignore silently if individual repo commits fetch is rate-limited
    }
  }

  // Filter cursed commits
  const cursedCommits = commits.filter((c) => {
    const msg = c.message.trim();
    if (msg.length <= 6) return true;
    return CURSED_PATTERNS.some((pattern) => pattern.test(msg));
  });

  // Calculate commit metrics
  const lateNightCommitsCount = commits.filter((c) => c.hour >= 0 && c.hour <= 5).length;
  const weekendCommitsCount = commits.filter((c) => c.isWeekend).length;

  const totalCommitLength = commits.reduce((sum, c) => sum + c.message.length, 0);
  const averageCommitMessageLength = commits.length > 0 ? Math.round(totalCommitLength / commits.length) : 15;

  // Aggregate languages & repository stats
  const languageCounts: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let abandonedReposCount = 0;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const sampleRepoNames: string[] = [];

  if (Array.isArray(repos)) {
    for (const r of repos) {
      if (r.name) {
        sampleRepoNames.push(r.name);
      }
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
      totalStars += r.stargazers_count || 0;
      totalForks += r.forks_count || 0;

      const updatedAt = new Date(r.pushed_at || r.updated_at);
      if (r.stargazers_count <= 1 && updatedAt < sixMonthsAgo && !r.fork) {
        abandonedReposCount++;
      }
    }
  }

  const topLanguages = Object.entries(languageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const createdYear = new Date(user.created_at).getFullYear();
  const currentYear = new Date().getFullYear();
  const accountAgeYears = Math.max(1, currentYear - createdYear);

  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at,
    blog: user.blog,
    company: user.company,
    location: user.location,
    topLanguages,
    totalStars,
    totalForks,
    recentCommits: commits.slice(0, 20),
    cursedCommits: cursedCommits.slice(0, 10),
    lateNightCommitsCount,
    weekendCommitsCount,
    abandonedReposCount,
    averageCommitMessageLength,
    sampleRepoNames: sampleRepoNames.slice(0, 6),
    accountAgeYears,
  };
}

