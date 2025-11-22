const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function getHealth() {
  const res = await fetch(`${base}/`)
  return res.json()
}

export async function syncUser(user: string) {
  const res = await fetch(`${base}/github/sync/${encodeURIComponent(user)}`, {
    method: 'POST',
  })
  return res.json()
}

export async function syncRepo(user: string, repo: string) {
  const res = await fetch(
    `${base}/github/sync/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`,
    { method: 'POST' },
  )
  return res.json()
}

export async function listRepos(user: string) {
  const res = await fetch(`${base}/github/${encodeURIComponent(user)}/repos`)
  return res.json()
}

export async function searchRepos(query: string) {
  const res = await fetch(`${base}/github/search?query=${encodeURIComponent(query)}`)
  return res.json()
}

export async function stats(params?: { user?: string; topN?: number }) {
  const u = new URL(`${base}/github/stats`)
  if (params?.user) u.searchParams.set('user', params.user)
  if (params?.topN) u.searchParams.set('topN', String(params.topN))
  const res = await fetch(u)
  return res.json()
}