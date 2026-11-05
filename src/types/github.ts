export interface GithubData {
  stars: number; forks: number; commits: number; contributors: number;
  open_issues: number; last_commit: string | null;
  languages: { name: string; percentage: number; color: string }[];
  health_score: number;
  overview?: {
    description: string; license: string; default_branch: string; size: number;
    topics: string[]; created_at: string; updated_at: string; homepage: string; language: string;
  };
  issues?: unknown[];
  error?: string;
}
