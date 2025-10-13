import axios from 'axios';

export async function fetchGithubUser(login: string) {
  const url = `https://api.github.com/users/${encodeURIComponent(login)}`;
  const { data } = await axios.get(url, { headers: { Accept: 'application/vnd.github+json' } });
  return data as { id: number; login: string; avatar_url?: string | null };
}

export async function fetchAllRepos(login: string) {
  const perPage = 100;
  let page = 1;
  const all: any[] = [];
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=${perPage}&page=${page}`;
    const { data } = await axios.get(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < perPage) break;
    page += 1;
  }
  return all;
}

export async function fetchGithubRepo(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const { data } = await axios.get(url, { headers: { Accept: 'application/vnd.github+json' } });
  return data as any;
}