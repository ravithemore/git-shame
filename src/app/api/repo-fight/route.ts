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

    // Categories
    const categoryWinners = [
      {
        category: "Commit Message Quality Disaster",
        winner:
          stats1.cursedCommits.length >= stats2.cursedCommits.length
            ? stats1.username
            : stats2.username,
        reason:
          stats1.cursedCommits.length >= stats2.cursedCommits.length
            ? `@${stats1.username} authored ${stats1.cursedCommits.length} single-word/cursed commits (e.g. '${stats1.cursedCommits[0]?.message || 'fix'}')`
            : `@${stats2.username} authored ${stats2.cursedCommits.length} single-word/cursed commits (e.g. '${stats2.cursedCommits[0]?.message || 'update'}')`,
      },
      {
        category: "Nocturnal Vampire Coder (12am-5am)",
        winner:
          stats1.lateNightCommitsCount >= stats2.lateNightCommitsCount
            ? stats1.username
            : stats2.username,
        reason:
          stats1.lateNightCommitsCount >= stats2.lateNightCommitsCount
            ? `@${stats1.username} committed ${stats1.lateNightCommitsCount} times in the dead of night`
            : `@${stats2.username} committed ${stats2.lateNightCommitsCount} times in the dead of night`,
      },
      {
        category: "Graveyard of Abandoned Repos",
        winner:
          stats1.abandonedReposCount >= stats2.abandonedReposCount
            ? stats1.username
            : stats2.username,
        reason:
          stats1.abandonedReposCount >= stats2.abandonedReposCount
            ? `@${stats1.username} is hoarding ${stats1.abandonedReposCount} dead projects`
            : `@${stats2.username} is hoarding ${stats2.abandonedReposCount} dead projects`,
      },
      {
        category: "Overall Git Shame Champion",
        winner: roast1.shameScore >= roast2.shameScore ? stats1.username : stats2.username,
        reason:
          roast1.shameScore >= roast2.shameScore
            ? `@${stats1.username} takes the shame crown with a score of ${roast1.shameScore}/100!`
            : `@${stats2.username} takes the shame crown with a score of ${roast2.shameScore}/100!`,
      },
    ];

    const shameChampion =
      roast1.shameScore >= roast2.shameScore ? stats1.username : stats2.username;

    const battleSummary = `@${shameChampion} has been officially declared the bigger menace to version control and software stability.`;

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
