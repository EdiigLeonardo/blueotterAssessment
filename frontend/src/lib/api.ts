const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function getHealth() {
  const res = await fetch(`${base}/`)
  return res.json()
}

export async function getUsers() {
  const res = await fetch(`${base}/github/users`)
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
  const qs = new URLSearchParams()
  if (params?.user) qs.set('user', params.user)
  if (params?.topN) qs.set('topN', String(params.topN))
  const url = `${base}/github/stats${qs.toString() ? `?${qs.toString()}` : ''}`
  const res = await fetch(url)
  return res.json()
}
