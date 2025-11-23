export interface RepoItem {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  created_at: string
}

export interface StatsResponse {
  summary: { total_repos: number; total_users?: number }
  languages: Record<string, number>
  top_users_by_repos?: { user: string; repos: number }[]
  timeline_created_monthly: { month: string; count: number }[]
}

export type User = {
  id: number
  login: string
  avatar_url: string
}