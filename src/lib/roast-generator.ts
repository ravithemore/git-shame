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
  
  // Try ultra-fast gemini-flash-lite-latest first, fallback to gemini-3.8-flash
  const modelsToTry = ["gemini-flash-lite-latest", "gemini-3.8-flash"];
  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
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
- Name: ${stats.name || stats.username}
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
        stats.recentCommits.slice(0, 8).map((c) => c.message)
      )}
- Cursed Commits Found: ${JSON.stringify(
        stats.cursedCommits.slice(0, 5).map((c) => c.message)
      )}

Requirements:
- Make the roast hyper-specific to @${stats.username}, their languages, their specific repos (${stats.sampleRepoNames?.join(", ") || "general"}), and their bio!
- Do NOT use generic insults. Mock their actual tech stack, their follower ratio, and their account longevity.
- Ensure the output is strictly valid JSON matching this schema:

{
  "username": "${stats.username}",
  "name": "${stats.name || stats.username}",
  "avatarUrl": "${stats.avatarUrl}",
  "shameScore": <unique number between 55 and 99 reflecting how roasted they are>,
  "title": "<hilarious satirical job title tailored to their stack, e.g. Senior Git Rebase Survivor, Chief npm Install Operator, or Director of 3AM Hotfixes>",
  "roastParagraph": "<2-3 paragraphs of hilarious, hyper-specific roast mocking their specific languages, repos, cursed commit messages, and bio>",
  "devPersonality": "<funny archetypal dev diagnosis, e.g. 'StackOverflow Copypasta Alchemist' or '3am Red Bull Committer'>",
  "worstHabits": [
    "<worst habit 1>",
    "<worst habit 2>",
    "<worst habit 3>"
  ],
  "cursedCommits": [
    {
      "message": "<cursed commit message>",
      "repo": "<repo name>",
      "date": "<date or recent>",
      "verdict": "<short funny 1-liner critique of this commit>"
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
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Model ${modelName} failed:`, lastError.message);
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

export function generateHeuristicRoast(stats: GitHubStats, tone: RoastTone): RoastResult {
  const topLang = stats.topLanguages[0]?.name || "TypeScript";
  const secondLang = stats.topLanguages[1]?.name || "CSS";
  const cursedCount = stats.cursedCommits.length;
  const lateNight = stats.lateNightCommitsCount;
  const ghostRepos = stats.abandonedReposCount;
  const repos = stats.sampleRepoNames || [];
  const featuredRepo = repos[0] || `${stats.username}-app`;

  // Deterministic user signature calculation
  const userHash = stats.username
    .split("")
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 3) * 17, 0);

  // Compute a distinctive shame score
  let calculatedScore = 55 + (userHash % 25);
  if (cursedCount > 1) calculatedScore += 6;
  if (lateNight > 0) calculatedScore += 7;
  if (ghostRepos > 1) calculatedScore += 5;
  if (stats.publicRepos > 10) calculatedScore += 4;
  if (stats.followers < 5) calculatedScore += 5;
  const shameScore = Math.min(98, Math.max(52, calculatedScore));

  const titlesPool: Record<RoastTone, string[]> = {
    savage: [
      `Lead ${topLang} Copypasta Connoisseur`,
      "Chief Technical Debt Officer",
      "Git Push --Force Anarchist",
      `Architect of Unmaintainable ${topLang} Monoliths`,
      "Senior StackOverflow Archaeology Specialist",
      "VP of Missing Unit Test Suites",
      "Production Deployer on Friday 5:00 PM",
      `Certified ${topLang} Bug Exterminator (Uncertified)`,
      "Master of 3 AM Console.log Debugging",
    ],
    corporate: [
      "VP of Asynchronous Synergy Deficits",
      "Principal Jira Ticket Procrastinator",
      "Director of Unaligned Branch Strategies",
      `Strategic Lead for ${topLang} Overhead Initiatives`,
      "Head of Cross-Functional Technical Entropy",
      "Senior Manager of Unmaintainable Prototypes",
      "Chief Agile Methodology Circumventer",
    ],
    boomer: [
      `Youngster Who Thinks ${topLang} is Real Engineering`,
      "Certified Node_Modules Black Hole Operator",
      "Div Centering Specialist (Failed 4 Times)",
      "Docker Container Hoarder",
      "Junior Framework Tourist",
      "Terminal-Phobic IDE Dependent",
      "Believer in Serverless Magic",
    ],
    fbi: [
      `Serial Offender of Nocturnal ${topLang} Sins`,
      "Person of Interest in Unresolved Merge Conflicts",
      "Wanted for Willful Neglect of Semantic Versioning",
      "Perpetual Offender of git commit -m 'wip'",
      "Undercover Junior Disguised as Staff Architect",
      "Suspect in Unregistered Memory Leaks",
    ],
  };

  const pool = titlesPool[tone];
  const selectedTitle = pool[(userHash + stats.publicRepos) % pool.length];

  // Language specific snark
  const languageJokes: Record<string, string> = {
    JavaScript: "relies on 800MB of node_modules just to reverse an array",
    TypeScript: "types everything as 'any' the instant the compiler asks a single question",
    Python: "believes 4 levels of indentation qualify as enterprise microservice architecture",
    Java: "needs 14 AbstractFactoryBuilderManagerBeans just to print 'Hello World'",
    C: "treats segmentation faults as nostalgic emotional milestones",
    "C++": "has never met a raw pointer they couldn't accidentally double-free",
    HTML: "calls themselves a senior fullstack engineer with 90% HTML repositories",
    PHP: "is personally keeping 2005 MySQL tutorials alive against all odds",
    Go: "writes 'if err != nil' 400 times a day and calls it peak design elegance",
    Rust: "spends 6 hours fighting the borrow checker instead of shipping any product",
    Kotlin: "treats Elvis operators as a substitute for actual null safety architecture",
    Swift: "forces unwrapping optionals with '!' and prays during App Store review",
  };
  const langJoke = languageJokes[topLang] || `writes ${topLang} that keeps senior staff architects awake at night`;

  const bioNote = stats.bio ? ` Their bio boldly claims "${stats.bio}", which code review has confirmed to be purely aspirational.` : "";

  let roastParagraph = "";

  if (tone === "savage") {
    roastParagraph =
      `Let's talk about @${stats.username}. You've spent ${stats.accountAgeYears} year${stats.accountAgeYears > 1 ? "s" : ""} on GitHub, building a sprawling graveyard of ${stats.publicRepos} public repositories—including certified gems like '${featuredRepo}'—yet somehow ${langJoke}.${bioNote}\n\n` +
      `With ${stats.followers} followers and ${stats.following} following, your git profile exudes the distinct energy of someone screaming into an abandoned Discord voice channel. Your commit cadence suggests you treat git not as version control, but as a confidential diary where you confess your sins with messages like "${stats.cursedCommits[0]?.message || 'fix bug please'}" at 2:48 AM.\n\n` +
      `You've accumulated ${stats.totalStars} total stars. Close VS Code, stop copy-pasting answers from dead Medium posts, and write at least one unit test before force-pushing to main again.`;
  } else if (tone === "corporate") {
    roastParagraph =
      `We have completed our 360-degree technical alignment review for @${stats.username}.${bioNote}\n\n` +
      `While we appreciate your enthusiastic throughput across ${stats.publicRepos} deliverables (specifically initiatives like '${featuredRepo}'), your repository cadence in ${topLang} demonstrates a critical deficiency in enterprise velocity. Pushing changes with messages like "${stats.cursedCommits[0]?.message || 'updates'}" does not facilitate scalable stakeholder alignment.\n\n` +
      `Furthermore, your ${ghostRepos} dormant deliverables indicate significant unamortized technical debt. Let's schedule an offline sync to circle back on establishing standard QA KPIs before your next pull request.`;
  } else if (tone === "boomer") {
    roastParagraph =
      `Back in my day, we built operating systems on punch cards with 16KB of magnetic core memory, and here is @${stats.username} using ${topLang} and ${secondLang} to assemble '${featuredRepo}' and ${langJoke}!${bioNote}\n\n` +
      `You've been on GitHub for ${stats.accountAgeYears} years and you still haven't learned how to write a commit message longer than 6 characters? "${stats.cursedCommits[0]?.message || 'fix'}"?! In 1981, a commit message like that would have resulted in an immediate revocation of lab badge access!\n\n` +
      `Go read the UNIX manual, delete half of your dependencies, and learn how memory allocation actually works.`;
  } else {
    roastParagraph =
      `INCIDENT DOSSIER: Subject @${stats.username}. Threat Classification: CODE-SINS-OMEGA.${bioNote}\n\n` +
      `Forensic inspection of the subject's ${stats.publicRepos} repositories (notably flagged asset: '${featuredRepo}') confirms habitual violations of source-code hygiene. Behavioral analysis reveals ${langJoke}, coupled with chronic nocturnal activity (${lateNight} confirmed operations during off-hours).\n\n` +
      `Physical evidence extracted from commit logs indicates extreme aversion to code review: repeated single-word transmissions such as "${stats.cursedCommits[0]?.message || 'patch'}". Recommendation: Immediate revocation of production write access.`;
  }

  const personalities = [
    `StackOverflow Copypasta Alchemist`,
    `Vibe-Coded ${topLang} Mercenary`,
    `Nocturnal Bug Exterminator (Failed)`,
    `3 AM Commit Terrorist`,
    `Unsupervised Junior Architect`,
    `Console.log Debugging Enthusiast`,
    `Dependency Hoarder Extraordinaire`,
    `Terminal-Averse IDE Romantic`,
  ];
  const devPersonality = personalities[(userHash + stats.followers) % personalities.length];

  const worstHabits = [
    stats.totalStars === 0
      ? `Maintains exactly 0 stars across ${stats.publicRepos} repositories (unblemished by public interest)`
      : `Hoards ${stats.totalStars} stars like priceless museum artifacts`,
    repos.length > 0
      ? `Abandoned project '${featuredRepo}' approximately 48 hours after 'Initial commit'`
      : `Creates empty repositories without READMEs or licenses`,
    `Habitual reliance on: '${stats.cursedCommits[0]?.message || "wip"}' as an architectural commit description`,
    `Primary debugging methodology consists of scattering 18 console.log statements across production`,
  ];

  const verdictsPool: Record<RoastTone, string[]> = {
    savage: [
      `Verdict: Grade F. Please step away from the keyboard and touch real grass immediately.`,
      `Verdict: 10/10 technical catastrophe. Your commit log belongs in a cautionary museum.`,
      `Verdict: A walking argument for requiring a government license before purchasing a mechanical keyboard.`,
      `Verdict: Production called. It wants you to stay at least 500 feet away at all times.`,
      `Verdict: Certified hazard to any team with a continuous deployment pipeline.`,
    ],
    corporate: [
      `Action Item: Recommended for mandatory sensitivity training on standard semantic commit protocols.`,
      `Deliverable: Placed on a 30-day technical remediation PIP pending unit test compliance.`,
      `Outcome: Sunset this engineer's write privileges until core KPIs demonstrate alignment.`,
      `Next Step: De-escalate subject from repository write access to read-only observer status.`,
    ],
    boomer: [
      `Final Grade: F-. Linus Torvalds is shaking his head in a terminal right now.`,
      `Assessment: Needs to delete node_modules, throw out their standing desk, and read K&R C.`,
      `Summary: In 1982, this code would have crashed an entire university mainframe.`,
      `Disposition: Hand over the root password and don't touch the shell ever again.`,
    ],
    fbi: [
      `Closing Assessment: Remanded to production jail with zero privileges to git rebase.`,
      `Disposition: Classified as a Level 4 Threat to Continuous Integration stability.`,
      `Sentence: 100 hours of community service writing automated Cypress test suites.`,
      `Ruling: Perpetually banned from pushing code between midnight and sunrise.`,
    ],
  };

  const vList = verdictsPool[tone];
  const verdict = vList[(userHash + stats.accountAgeYears) % vList.length];

  const cursedSample = stats.cursedCommits.slice(0, 3).map((c, i) => {
    const verdicts = [
      "CI/CD pipeline wept bitter tears over this",
      "A cry for help disguised as version control",
      "Approved at 4:18 AM out of sheer exhaustion",
      "The exact moment caffeine was replaced by despair",
      "An unforgivable crime against git history",
    ];
    return {
      message: c.message,
      repo: c.repo,
      date: c.date,
      verdict: verdicts[(userHash + i * 3) % verdicts.length],
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
      value: `${Math.max(6, 100 - shameScore)}/100`,
      critique: "Ancient Egyptian hieroglyphs are significantly more self-documenting.",
    },
    {
      label: "Production Readiness",
      value: `${Math.max(4, 94 - shameScore)}%`,
      critique: "One misplaced semicolon away from an emergency company blog post.",
    },
    {
      label: "Test Coverage",
      value: "0.0% (Faith-based)",
      critique: "Relies entirely on the 'it worked on my machine' doctrine.",
    },
    {
      label: "Imposter Syndrome",
      value: `${Math.min(99, shameScore + 15)}%`,
      critique: "For once, it appears to be statistically validated by git blame data.",
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
