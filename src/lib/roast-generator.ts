import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubStats, RoastResult, RoastTone } from "@/types";

// In-memory cache to save AI quota and keep response times sub-100ms for repeated usernames
const roastCache = new Map<string, { result: RoastResult; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export async function generateRoast(stats: GitHubStats, tone: RoastTone = "savage"): Promise<RoastResult> {
  const cacheKey = `${stats.username.toLowerCase()}:${tone}`;
  const cached = roastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  let result: RoastResult;

  if (process.env.GEMINI_API_KEY) {
    try {
      result = await generateWithGemini(stats, tone);
    } catch (err) {
      console.warn("Gemini generation failed, falling back to heuristic engine:", err);
      result = generateHeuristicRoast(stats, tone);
    }
  } else {
    result = generateHeuristicRoast(stats, tone);
  }

  roastCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

async function generateWithGemini(stats: GitHubStats, tone: RoastTone): Promise<RoastResult> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.9,
    },
  });

  const prompt = `You are GitShame, an elite, hilariously witty developer judge. Roast this GitHub developer based on their real profile stats and commit history.
Tone requested: "${tone}" (${
    tone === "savage"
      ? "Savage, brutal tech Twitter & Gordon Ramsay insult style"
      : tone === "corporate"
      ? "Passive-aggressive HR / LinkedIn corporate speak with fake polite buzzwords"
      : tone === "boomer"
      ? "10x Graybeard Architect complaining about young devs and 500MB node_modules"
      : "FBI psychological profiler analyzing a cyber-degenerate's criminal code habits"
  }).

Developer Stats:
- Username: ${stats.username}
- Name: ${stats.name}
- Bio: "${stats.bio || "No bio provided (already hiding something)"}"
- Public Repos: ${stats.publicRepos}
- Followers: ${stats.followers} | Following: ${stats.following}
- Top Languages: ${stats.topLanguages.map((l) => `${l.name} (${l.count} repos)`).join(", ") || "None"}
- Total Stars: ${stats.totalStars} | Total Forks: ${stats.totalForks}
- Abandoned/Dead Repos: ${stats.abandonedReposCount}
- Late Night (12am-5am) Commits: ${stats.lateNightCommitsCount}
- Weekend Commits: ${stats.weekendCommitsCount}
- Average Commit Message Length: ${stats.averageCommitMessageLength} characters
- Actual Commit Messages Sample: ${JSON.stringify(
    stats.recentCommits.slice(0, 10).map((c) => c.message)
  )}
- Cursed Commits Found: ${JSON.stringify(
    stats.cursedCommits.slice(0, 6).map((c) => c.message)
  )}

Return a strict JSON object with this EXACT structure:
{
  "username": "${stats.username}",
  "name": "${stats.name || stats.username}",
  "avatarUrl": "${stats.avatarUrl}",
  "shameScore": <number between 45 and 99 reflecting how roasted they are>,
  "title": "<hilarious satirical job title, e.g. Senior Git Rebase Survivor or Chief Technical Debt Officer>",
  "roastParagraph": "<2-3 paragraphs of hilarious, hyper-specific roast mocking their specific languages, ghost repos, cursed commit messages, and bio>",
  "devPersonality": "<funny archetypal dev diagnosis, e.g. 'StackOverflow Copypasta Alchemist' or '3am Red Bull Committer'>",
  "worstHabits": [
    "<worst habit 1, e.g. 'Pushes directly to main without running tests'>",
    "<worst habit 2, e.g. 'Treats commit messages like disposable SMS texts'>",
    "<worst habit 3, e.g. 'Accumulating 14 abandoned repos with 1 initial commit'>"
  ],
  "cursedCommits": [
    ${
      stats.cursedCommits.length > 0
        ? stats.cursedCommits
            .slice(0, 4)
            .map(
              (c) =>
                `{"message": ${JSON.stringify(c.message)}, "repo": ${JSON.stringify(
                  c.repo
                )}, "date": ${JSON.stringify(
                  c.date
                )}, "verdict": "<short funny 1-liner critique of this commit>"}`
            )
            .join(",")
        : `{"message": "Initial commit", "repo": "abandoned-project", "date": "2023-01-01", "verdict": "Born to build, forced to abandon after 1 file"}`
    }
  ],
  "statDiagnoses": [
    { "label": "Code Readability", "value": "<e.g. 12/100>", "critique": "<short 1-line joke>" },
    { "label": "Emotional Stability", "value": "<e.g. 404 Not Found>", "critique": "<short 1-line joke>" },
    { "label": "Test Coverage", "value": "<e.g. 0% (Vibes based)>", "critique": "<short 1-line joke>" },
    { "label": "Imposter Syndrome", "value": "<e.g. 140%>", "critique": "<short 1-line joke>" }
  ],
  "verdict": "<A punchy 1-line closing diagnosis or life advice for this dev>",
  "tone": "${tone}"
}`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const parsed = JSON.parse(text) as RoastResult;
  parsed.avatarUrl = stats.avatarUrl;
  parsed.username = stats.username;
  parsed.tone = tone;
  return parsed;
}

export function generateHeuristicRoast(stats: GitHubStats, tone: RoastTone): RoastResult {
  const topLang = stats.topLanguages[0]?.name || "JavaScript";
  const cursedCount = stats.cursedCommits.length;
  const lateNight = stats.lateNightCommitsCount;
  const ghostRepos = stats.abandonedReposCount;

  // Shame Score calculation based on realistic offenses
  let baseScore = 65;
  if (cursedCount > 3) baseScore += 12;
  if (lateNight > 2) baseScore += 8;
  if (ghostRepos > 4) baseScore += 7;
  if (stats.followers < 5 && stats.following > 50) baseScore += 6;
  if (stats.averageCommitMessageLength < 10) baseScore += 5;
  const shameScore = Math.min(98, Math.max(52, baseScore));

  const titles: Record<RoastTone, string[]> = {
    savage: [
      "Chief Technical Debt Officer",
      "Git Push --Force Terrorist",
      "Senior Copypasta Connoisseur",
      "Lead StackOverflow Archaeology Engineer",
      "Vibe-Driven Development Pioneer",
    ],
    corporate: [
      "VP of Asynchronous Synergy Deficits",
      "Director of Unaligned Branch Strategies",
      "Principal Jira Ticket Procrastinator",
      "Senior Manager of Unmaintainable Prototypes",
      "Head of Cross-Functional Technical Entropy",
    ],
    boomer: [
      "Youngster Who Never Wrote Assembly",
      "Certified Node_Modules Black Hole Operator",
      "Junior Framework Tourist",
      "Div Centering Specialist (Failed)",
      "Docker Container Hoarder",
    ],
    fbi: [
      "Serial Committer to Production at 3:42 AM",
      "Person of Interest in Unresolved Merge Conflicts",
      "Wanted for Willful Neglect of Unit Testing",
      "Undercover Junior Disguised as Staff Engineer",
      "Perpetual Offender of git add . && git commit -m 'asdf'",
    ],
  };

  const selectedTitle = titles[tone][Math.floor(Math.random() * titles[tone].length)];

  // Craft dynamic personalized paragraphs
  let roastParagraph = "";
  if (tone === "savage") {
    roastParagraph = `Let's talk about @${stats.username}. You have ${stats.publicRepos} public repositories, yet judging by your activity, about ${ghostRepos} of them exist solely as digital graveyards where unfinished weekend epiphanies go to rot. You primarily sling ${topLang}, which explains why you treat your commit log like an unedited group chat transcript.\n\n` +
      `Your average commit message length is ${stats.averageCommitMessageLength} characters. You don't write commit summaries; you drop emotional breadcrumbs. We found commits like "${stats.cursedCommits[0]?.message || 'fix'}" pushed with the confidence of someone who has never heard of a CI/CD pipeline or a staging environment.\n\n` +
      `With ${stats.followers} followers and ${stats.following} following, your GitHub ratio looks like an aspiring cryptocurrency influencer's secondary account. Close the IDE, get some sleep, and for the love of Linus Torvalds, write at least one unit test before the decade ends.`;
  } else if (tone === "corporate") {
    roastParagraph = `Thank you for submitting your profile for our 360-degree technical alignment review, @${stats.username}.\n\n` +
      `While we acknowledge your proactive bandwidth across ${stats.publicRepos} public deliverables, our cross-functional audit flagged a significant deficit in your commit documentation cadence. Pushing changes labeled "${stats.cursedCommits[0]?.message || 'update'}" fails to facilitate scalable stakeholder transparency.\n\n` +
      `Furthermore, your ${ghostRepos} dormant repository initiatives indicate an opportunity to sunset unmonetized technical debt. Let's schedule an offline sync to circle back on establishing standard QA KPIs before your next push to master.`;
  } else if (tone === "boomer") {
    roastParagraph = `Look at this, back in my day we had 64 kilobytes of magnetic core memory and we sent men to the moon with less code than you need to import your favorite date picker.\n\n` +
      `You're out here in ${topLang} pulling down 400 megabytes of dependencies just to display a button that still overflows the container on mobile! You've got ${stats.publicRepos} repos and half of them have names like 'test-app-3' and 'new-portfolio-final'.\n\n` +
      `And what in tarnation are these commit messages? "${stats.cursedCommits[0]?.message || 'fix bug'}"? Back then we documented every single register allocation in cursive handwriting! Go read the UNIX man pages and repent!`;
  } else {
    roastParagraph = `SUBJECT DOSSIER: @${stats.username}. File Classification: CODE-SINS-ALPHA.\n\n` +
      `Forensic analysis of the subject's GitHub footprint reveals recurring patterns of nocturnal erratic behavior: ${lateNight} confirmed operations conducted between midnight and 0500 hours. The subject displays blatant disregard for semantic versioning and demonstrates high dependency on unverified open-source packages.\n\n` +
      `Key physical evidence includes repetitive, cryptic transmissions into public source repositories: "${stats.cursedCommits[0]?.message || 'changes'}". Behavioral analysts conclude the subject is operating under severe caffeine intoxication and an acute aversion to pull request peer reviews.`;
  }

  const worstHabits = [
    stats.averageCommitMessageLength < 12
      ? "Treats commit messages like rapid-fire WhatsApp status updates"
      : "Writes thesis-length commit messages for 1-line CSS changes",
    lateNight > 0
      ? `Conducts unmonitored code surgery between 12 AM and 5 AM (${lateNight} times)`
      : "Avoids nighttime commits because debugging while conscious is hard enough",
    ghostRepos > 2
      ? `Maintains a digital cemetery of ${ghostRepos} abandoned 'revolutionary' side projects`
      : "Hoards empty markdown files like family heirlooms",
    cursedCount > 0
      ? `Habitual offender of single-word commit terrorism: '${stats.cursedCommits[0]?.message || "wip"}'`
      : "Relies on 'git push --force' as an emotional coping mechanism",
  ];

  const cursedSample = stats.cursedCommits.slice(0, 4).map((c, i) => {
    const verdicts = [
      "CI/CD wept bitter tears over this one",
      "A cry for help masquerading as version control",
      "Code review approved by sheer exhaustion",
      "The exact moment caffeine was replaced by pure despair",
    ];
    return {
      message: c.message,
      repo: c.repo,
      date: c.date,
      verdict: verdicts[i % verdicts.length],
    };
  });

  if (cursedSample.length === 0) {
    cursedSample.push({
      message: "Initial commit",
      repo: stats.publicRepos > 0 ? "first-project" : "my-repo",
      date: stats.createdAt,
      verdict: "The beginning of the end. It only went downhill from here.",
    });
  }

  const statDiagnoses = [
    {
      label: "Code Readability",
      value: `${Math.max(12, 100 - shameScore)}/100`,
      critique: "Hieroglyphs offer more self-documenting syntax.",
    },
    {
      label: "Production Readiness",
      value: `${Math.max(8, 90 - shameScore)}%`,
      critique: "One wrong environment variable away from a total company outage.",
    },
    {
      label: "Test Coverage",
      value: "0.0% (Faith-based)",
      critique: "Relies entirely on the 'it worked on my localhost' protocol.",
    },
    {
      label: "Imposter Syndrome",
      value: `${shameScore + 15}%`,
      critique: "For once, it might actually be statistically justified.",
    },
  ];

  const verdicts: Record<RoastTone, string> = {
    savage: "Verdict: 10/10 technical hazard. Please unplug your keyboard and touch real grass immediately.",
    corporate: "Action Item: Recommended for mandatory sensitivity training on standard git hygiene protocols.",
    boomer: "Final Grade: F-. Linus Torvalds is rolling in his terminal.",
    fbi: "Closing Assessment: Remanded to production jail with zero privileges to git rebase.",
  };

  return {
    username: stats.username,
    name: stats.name || stats.username,
    avatarUrl: stats.avatarUrl,
    shameScore,
    title: selectedTitle,
    roastParagraph,
    devPersonality:
      tone === "corporate"
        ? "Agile Sprint Staller"
        : tone === "boomer"
        ? "Vim-Phobic Millennial"
        : tone === "fbi"
        ? "Unconvicted Merge Conflict Instigator"
        : "Vibe-Coded Architecture Enthusiast",
    worstHabits,
    cursedCommits: cursedSample,
    statDiagnoses,
    verdict: verdicts[tone],
    tone,
  };
}
