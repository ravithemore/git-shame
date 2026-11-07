export type RoastTone = 'savage' | 'corporate' | 'boomer' | 'fbi';

export interface GitHubCommitSample {
  sha: string;
  message: string;
  date: string;
  repo: string;
  hour: number; // 0-23
  isWeekend: boolean;
}

export interface GitHubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  blog: string | null;
  company: string | null;
  location: string | null;
  topLanguages: { name: string; count: number }[];
  totalStars: number;
  totalForks: number;
  recentCommits: GitHubCommitSample[];
  cursedCommits: GitHubCommitSample[];
  lateNightCommitsCount: number;
  weekendCommitsCount: number;
  abandonedReposCount: number; // repos with 0 stars and no recent updates
  averageCommitMessageLength: number;
}

export interface RoastResult {
  username: string;
  name: string;
  avatarUrl: string;
  shameScore: number; // 0 - 100
  title: string; // e.g. "Chief Technical Debt Officer"
  roastParagraph: string;
  devPersonality: string; // e.g. "StackOverflow Copypasta Specialist"
  worstHabits: string[];
  cursedCommits: {
    message: string;
    repo: string;
    date: string;
    verdict: string;
  }[];
  statDiagnoses: {
    label: string;
    value: string;
    critique: string;
  }[];
  verdict: string;
  tone: RoastTone;
}

export interface VsBattleResult {
  player1: RoastResult;
  player2: RoastResult;
  winner: string; // the more shameless or winner of battle
  battleSummary: string;
  categoryWinners: {
    category: string;
    winner: string;
    reason: string;
  }[];
}
