import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUserData } from "@/lib/github";
import { generateRoast } from "@/lib/roast-generator";
import { VsBattleResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { user1, user2 } = await req.json();

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: "Both user1 and user2 usernames are required for battle." },
        { status: 400 }
      );
    }

    const [stats1, stats2] = await Promise.all([
      fetchGitHubUserData(user1),
      fetchGitHubUserData(user2),
    ]);

    const [roast1, roast2] = await Promise.all([
      generateRoast(stats1, "savage"),
      generateRoast(stats2, "savage"),
    ]);

    // Ensure shame scores are never identical
    if (roast1.shameScore === roast2.shameScore) {
      if (stats1.publicRepos >= stats2.publicRepos) {
        roast1.shameScore = Math.min(99, roast1.shameScore + ((stats1.followers % 5) + 3));
      } else {
        roast2.shameScore = Math.min(99, roast2.shameScore + ((stats2.followers % 5) + 3));
      }
    }

    // Ensure titles are never identical
    if (roast1.title === roast2.title) {
      roast2.title = `Challenger: ${stats2.topLanguages[0]?.name || "Code"} Entropy Specialist`;
    }

    // Ensure verdicts are never identical
    if (roast1.verdict === roast2.verdict) {
      roast2.verdict = `Verdict: Runner-up in technical debt. Still an active hazard to continuous delivery.`;
    }

    // Dynamic category faceoffs
    const categoryWinners = [
      {
        category: "Commit Hygiene Disaster",
        winner:
          stats1.cursedCommits.length >= stats2.cursedCommits.length
            ? stats1.username
            : stats2.username,
        reason:
          stats1.cursedCommits.length >= stats2.cursedCommits.length
            ? `@${stats1.username} authored ${stats1.cursedCommits.length} single-word commits (e.g. '${stats1.cursedCommits[0]?.message || 'fix'}') vs @${stats2.username}'s ${stats2.cursedCommits.length}`
            : `@${stats2.username} authored ${stats2.cursedCommits.length} single-word commits (e.g. '${stats2.cursedCommits[0]?.message || 'update'}') vs @${stats1.username}'s ${stats1.cursedCommits.length}`,
      },
      {
        category: "Nocturnal Vampire Coder (12 AM - 5 AM)",
        winner:
          stats1.lateNightCommitsCount >= stats2.lateNightCommitsCount
            ? stats1.username
            : stats2.username,
        reason:
          stats1.lateNightCommitsCount >= stats2.lateNightCommitsCount
            ? `@${stats1.username} committed ${stats1.lateNightCommitsCount} times in the dead of night vs @${stats2.username}'s ${stats2.lateNightCommitsCount}`
            : `@${stats2.username} committed ${stats2.lateNightCommitsCount} times in the dead of night vs @${stats1.username}'s ${stats1.lateNightCommitsCount}`,
      },
      {
        category: "Graveyard of Abandoned Repositories",
        winner:
          stats1.abandonedReposCount >= stats2.abandonedReposCount
            ? stats1.username
            : stats2.username,
        reason:
          stats1.abandonedReposCount >= stats2.abandonedReposCount
            ? `@${stats1.username} is hoarding ${stats1.abandonedReposCount} dead repos with 0 stars vs @${stats2.username}'s ${stats2.abandonedReposCount}`
            : `@${stats2.username} is hoarding ${stats2.abandonedReposCount} dead repos with 0 stars vs @${stats1.username}'s ${stats1.abandonedReposCount}`,
      },
      {
        category: "Seniority in Technical Debt",
        winner:
          stats1.accountAgeYears >= stats2.accountAgeYears
            ? stats1.username
            : stats2.username,
        reason:
          stats1.accountAgeYears >= stats2.accountAgeYears
            ? `@${stats1.username} has been committing crimes on GitHub for ${stats1.accountAgeYears} years vs @${stats2.username}'s ${stats2.accountAgeYears} years`
            : `@${stats2.username} has been committing crimes on GitHub for ${stats2.accountAgeYears} years vs @${stats1.username}'s ${stats1.accountAgeYears} years`,
      },
    ];

    const shameChampion =
      roast1.shameScore >= roast2.shameScore ? stats1.username : stats2.username;
    const runnerUp =
      shameChampion === stats1.username ? stats2.username : stats1.username;

    const battleSummary = `After a ruthless code hygiene audit, @${shameChampion} has officially outperformed @${runnerUp} in sheer technical entropy.`;

    const result: VsBattleResult = {
      player1: roast1,
      player2: roast2,
      winner: shameChampion,
      battleSummary,
      categoryWinners,
    };

    return NextResponse.json({ success: true, battle: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to run battle";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
