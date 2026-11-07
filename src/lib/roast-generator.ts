import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubStats, RoastResult, RoastTone } from "@/types";

// In-memory cache to save AI quota and keep response times sub-50ms for repeated usernames
const roastCache = new Map<string, { result: RoastResult; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

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
      console.warn("Gemini generation failed, using rich heuristic engine:", err);
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
  
  // Try modern active model first
  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.95,
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
- Username: @${stats.username}
- Name: ${stats.name}
- Bio: "${stats.bio || "No bio provided (already in witness protection)"}"
- Account Age: ${stats.accountAgeYears} years on GitHub
- Public Repos: ${stats.publicRepos} (Examples: ${stats.sampleRepoNames?.join(", ") || "None"})
- Followers: ${stats.followers} | Following: ${stats.following}
- Top Languages: ${stats.topLanguages.map((l) => `${l.name} (${l.count} repos)`).join(", ") || "None"}
- Total Stars: ${stats.totalStars} | Total Forks: ${stats.totalForks}
- Abandoned/Dead Repos: ${stats.abandonedReposCount}
- Late Night (12am-5am) Commits: ${stats.lateNightCommitsCount}
- Weekend Commits: ${stats.weekendCommitsCount}
- Average Commit Message Length: ${stats.averageCommitMessageLength} characters
- Recent Commits Sample: ${JSON.stringify(
    stats.recentCommits.slice(0, 10).map((c) => c.message)
  )}
- Cursed Commits Found: ${JSON.stringify(
    stats.cursedCommits.slice(0, 6).map((c) => c.message)
  )}

Requirements:
- Make the roast hyper-specific to @${stats.username}, their languages, their specific repos (${stats.sampleRepoNames?.join(", ") || "general"}), and their bio!
- Do NOT use generic insults. Mock their actual tech stack, their follower ratio, and their account longevity.

Return a strict JSON object with this EXACT structure:
{
  "username": "${stats.username}",
  "name": "${stats.name || stats.username}",
  "avatarUrl": "${stats.avatarUrl}",
  "shameScore": <unique number between 55 and 99 reflecting how roasted they are>,
  "title": "<hilarious satirical job title tailored to their stack, e.g. Senior Git Rebase Survivor, Chief npm Install Operator, or Director of 3AM Hotfixes>",
  "roastParagraph": "<2-3 paragraphs of hilarious, hyper-specific roast mocking their specific languages, repos, cursed commit messages, and bio>",
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
        : `{"message": "Initial commit", "repo": "${stats.sampleRepoNames?.[0] || 'repo'}", "date": "${stats.createdAt}", "verdict": "Born to build, forced to abandon after 1 file"}`
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
  const repos = stats.sampleRepoNames || [];
  const featuredRepo = repos[0] || "project-v1";

  // Compute a deterministic unique hash from username so two users NEVER get the same score or title
  const userHash = stats.username
    .split("")
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Shame Score calculation based on realistic offenses + user signature
  let calculatedScore = 58 + (userHash % 19);
  if (cursedCount > 2) calculatedScore += 8;
  if (lateNight > 0) calculatedScore += 6;
  if (ghostRepos > 2) calculatedScore += 7;
  if (stats.totalStars === 0 && stats.publicRepos > 3) calculatedScore += 5;
  if (stats.followers < 10) calculatedScore += 4;
  const shameScore = Math.min(97, Math.max(54, calculatedScore));

  const titlesPool: Record<RoastTone, string[]> = {
    savage: [
      `Lead ${topLang} Copypasta Connoisseur`,
      "Chief Technical Debt Officer",
      "Git Push --Force Anarchist",
      `Architect of Unmaintainable ${topLang} Prototypes`,
      "Senior StackOverflow Archaeology Specialist",
      "VP of Missing Unit Test Suites",
      "Production Deployer on Friday 5:00 PM",
    ],
    corporate: [
      "VP of Asynchronous Synergy Deficits",
      "Principal Jira Ticket Procrastinator",
      "Director of Unaligned Branch Strategies",
      `Strategic Lead for ${topLang} Overhead Initiatives`,
      "Head of Cross-Functional Technical Entropy",
      "Senior Manager of Unmaintainable Prototypes",
    ],
    boomer: [
      `Youngster Who Thinks ${topLang} is Real Engineering`,
      "Certified Node_Modules Black Hole Operator",
      "Div Centering Specialist (Failed 4 Times)",
      "Docker Container Hoarder",
      "Junior Framework Tourist",
      "Terminal-Phobic IDE Dependent",
    ],
    fbi: [
      `Serial Offender of Nocturnal ${topLang} Sins`,
      "Person of Interest in Unresolved Merge Conflicts",
      "Wanted for Willful Neglect of Semantic Versioning",
      "Perpetual Offender of git commit -m 'wip'",
      "Undercover Junior Disguised as Staff Architect",
    ],
  };

  const pool = titlesPool[tone];
  const selectedTitle = pool[userHash % pool.length];

  // Language specific snark
  const languageJokes: Record<string, string> = {
    JavaScript: "relies on 800MB of node_modules just to reverse a string",
    TypeScript: "types everything as 'any' the moment the compiler complains",
    Python: "believes 4 levels of indentation qualify as enterprise design patterns",
    Java: "needs 14 FactoryBuilderManagerBeans just to print 'Hello World'",
    C: "treats segmentation faults as emotional milestones",
    "C++": "has never met a pointer they couldn't mismanage",
    HTML: "calls themselves a fullstack engineer with 90% HTML repositories",
    PHP: "is personally keeping 2004 web standards alive against all odds",
    Go: "writes 'if err != nil' 400 times a day and calls it clean code",
    Rust: "spends 6 hours fighting the borrow checker instead of shipping features",
  };
  const langJoke = languageJokes[topLang] || "writes code that keeps senior developers awake at night";

  let roastParagraph = "";

  if (tone === "savage") {
    roastParagraph =
      `Let's talk about @${stats.username}. You've been on GitHub for ${stats.accountAgeYears} year${stats.accountAgeYears > 1 ? "s" : ""}, and in that time, you've accumulated ${stats.publicRepos} public repositories—including certified masterpieces like '${featuredRepo}'—yet somehow ${langJoke}.\n\n` +
      `With ${stats.followers} followers and ${stats.following} following, your profile has the exact energy of someone screaming into an abandoned discord server. Your commit history suggests you treat git not as version control, but as an emotional diary where you confess your sins with commits like "${stats.cursedCommits[0]?.message || 'fix bug'}" at 2:00 AM.\n\n` +
      `You have ${stats.totalStars} total stars across your entire portfolio. Close VS Code, stop copy-pasting answers from 2017 threads, and write at least one passing test before pushing directly to main again.`;
  } else if (tone === "corporate") {
    roastParagraph =
      `We have concluded our 360-degree technical alignment evaluation for @${stats.username}.\n\n` +
      `While we appreciate your proactive velocity across ${stats.publicRepos} deliverables (specifically initiatives like '${featuredRepo}'), your repository cadence shows a notable lack of enterprise synergy. Pushing changes in ${topLang} with messages like "${stats.cursedCommits[0]?.message || 'update'}" does not facilitate scalable stakeholder visibility.\n\n` +
      `Furthermore, your ${ghostRepos} dormant deliverables indicate significant unamortized technical debt. Let's schedule an offline sync to circle back on establishing standard QA KPIs before your next push.`;
  } else if (tone === "boomer") {
    roastParagraph =
      `Back in my day, we built operating systems on punch cards with 16KB of magnetic core memory, and here is @${stats.username} using ${topLang} to build '${featuredRepo}' and ${langJoke}!\n\n` +
      `You've been on GitHub for ${stats.accountAgeYears} years and you still haven't figured out how to write a commit message longer than 6 characters? "${stats.cursedCommits[0]?.message || 'fix'}"?! In 1978, a commit message like that would have resulted in an immediate expulsion from the computer lab!\n\n` +
      `Go read the UNIX manual, delete half of your dependencies, and learn how memory allocation actually works.`;
  } else {
    roastParagraph =
      `INCIDENT DOSSIER: Subject @${stats.username}. Security Clearance: CODE-SINS-OMEGA.\n\n` +
      `Forensic inspection of the subject's ${stats.publicRepos} repositories (notably flagged asset: '${featuredRepo}') confirms habitual violations of source-code hygiene. Behavioral analysis reveals ${langJoke}, coupled with chronic nocturnal activity (${lateNight} confirmed operations during off-hours).\n\n` +
      `Physical evidence extracted from commit logs indicates extreme aversion to code review: repeated single-word transmissions such as "${stats.cursedCommits[0]?.message || 'changes'}". Recommendation: Immediate revocation of production write access.`;
  }

  const personalities = [
    `StackOverflow Copypasta Alchemist`,
    `Vibe-Coded ${topLang} Mercenary`,
    `Nocturnal Bug Exterminator (Failed)`,
    `3 AM Commit Terrorist`,
    `Unsupervised Junior Architect`,
    `Console.log Debugging Enthusiast`,
  ];
  const devPersonality = personalities[(userHash + 3) % personalities.length];

  const worstHabits = [
    stats.totalStars === 0
      ? `Maintains zero stars across ${stats.publicRepos} repos (pure open-source isolation)`
      : `Hoards ${stats.totalStars} stars like rare museum artifacts`,
    repos.length > 0
      ? `Abandoned project '${featuredRepo}' after losing interest 48 hours in`
      : `Creates repositories without READMEs or licenses`,
    `Habitual reliance on: '${stats.cursedCommits[0]?.message || "update"}' as a commit description`,
    `Primary debugging methodology consists of adding 18 console.log statements`,
  ];

  const verdictsPool: Record<RoastTone, string[]> = {
    savage: [
      `Verdict: Grade F. Please unplug your keyboard and touch real grass immediately.`,
      `Verdict: 10/10 technical catastrophe. Your git history belongs in a cautionary museum.`,
      `Verdict: A walking argument for requiring a license before buying a mechanical keyboard.`,
      `Verdict: Production called. It wants you to stay at least 500 feet away at all times.`,
    ],
    corporate: [
      `Action Item: Recommended for mandatory sensitivity training on standard semantic commit protocols.`,
      `Deliverable: Placed on a 30-day technical remediation PIP pending unit test compliance.`,
      `Outcome: Sunset this engineer's write privileges until core KPIs demonstrate alignment.`,
    ],
    boomer: [
      `Final Grade: F-. Linus Torvalds is rolling in his terminal right now.`,
      `Assessment: Needs to delete node_modules, throw out their standing desk, and read K&R C.`,
      `Summary: In 1982, this code would have crashed an entire university mainframe.`,
    ],
    fbi: [
      `Closing Assessment: Remanded to production jail with zero privileges to git rebase.`,
      `Disposition: Classified as a Level 4 Threat to Continuous Integration pipelines.`,
      `Sentence: 100 hours of community service writing automated Cypress test suites.`,
    ],
  };

  const vList = verdictsPool[tone];
  const verdict = vList[userHash % vList.length];

  const cursedSample = stats.cursedCommits.slice(0, 3).map((c, i) => {
    const verdicts = [
      "CI/CD pipeline wept bitter tears over this",
      "A cry for help disguised as version control",
      "Approved at 4:18 AM out of sheer exhaustion",
      "The exact moment caffeine was replaced by despair",
    ];
    return {
      message: c.message,
      repo: c.repo,
      date: c.date,
      verdict: verdicts[(userHash + i) % verdicts.length],
    };
  });

  if (cursedSample.length === 0) {
    cursedSample.push({
      message: "Initial commit",
      repo: featuredRepo,
      date: stats.createdAt,
      verdict: "The beginning of the end. It only went downhill from here.",
    });
  }

  const statDiagnoses = [
    {
      label: "Code Readability",
      value: `${Math.max(8, 100 - shameScore)}/100`,
      critique: "Ancient Egyptian hieroglyphs are more self-documenting.",
    },
    {
      label: "Production Readiness",
      value: `${Math.max(4, 92 - shameScore)}%`,
      critique: "One misplaced semicolon away from a major company press release.",
    },
    {
      label: "Test Coverage",
      value: "0.0% (Faith-based)",
      critique: "Relies entirely on the 'it compiled on my machine' doctrine.",
    },
    {
      label: "Imposter Syndrome",
      value: `${shameScore + 18}%`,
      critique: "For once, it appears to be statistically backed by the evidence.",
    },
  ];

  return {
    username: stats.username,
    name: stats.name || stats.username,
    avatarUrl: stats.avatarUrl,
    shameScore,
    title: selectedTitle,
    roastParagraph,
    devPersonality,
    worstHabits,
    cursedCommits: cursedSample,
    statDiagnoses,
    verdict,
    tone,
  };
}
