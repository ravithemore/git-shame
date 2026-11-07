import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUserData } from "@/lib/github";
import { generateRoast } from "@/lib/roast-generator";
import { RoastTone } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, tone = "savage" } = body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { error: "A valid GitHub username is required to dispense judgment." },
        { status: 400 }
      );
    }

    const cleanTone: RoastTone = ["savage", "corporate", "boomer", "fbi"].includes(tone)
      ? tone
      : "savage";

    const stats = await fetchGitHubUserData(username);
    const roast = await generateRoast(stats, cleanTone);

    return NextResponse.json({ success: true, stats, roast });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected catastrophe occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const tone = (searchParams.get("tone") as RoastTone) || "savage";

  if (!username) {
    return NextResponse.json(
      { error: "Provide ?username=<handle> in the query parameter." },
      { status: 400 }
    );
  }

  try {
    const stats = await fetchGitHubUserData(username);
    const roast = await generateRoast(stats, tone);
    return NextResponse.json({ success: true, stats, roast });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch and roast.";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

