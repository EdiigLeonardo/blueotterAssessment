import { prisma } from '../db/prisma';
import { fetchGithubUser, fetchAllRepos, fetchGithubRepo } from '../lib/githubApi';

export class GithubService {
  async syncUserRepos(login: string) {
    const ghUser = await fetchGithubUser(login);
    const user = await prisma.githubUser.upsert({
      where: { id: ghUser.id },
      update: { login: ghUser.login, avatarUrl: ghUser.avatar_url ?? null },
      create: { id: ghUser.id, login: ghUser.login, avatarUrl: ghUser.avatar_url ?? null },
    });
    const repos = await fetchAllRepos(login);
    for (const r of repos) {
      await prisma.githubRepo.upsert({
        where: { id: r.id },
        update: {
          name: r.name,
          description: r.description ?? null,
          htmlUrl: r.html_url,
          language: r.language ?? null,
          createdAt: new Date(r.created_at),
          userId: user.id,
        },
        create: {
          id: r.id,
          name: r.name,
          description: r.description ?? null,
          htmlUrl: r.html_url,
          language: r.language ?? null,
          createdAt: new Date(r.created_at),
          userId: user.id,
        },
      });
    }
    return { synced: repos.length, user: user.login };
  }

  async syncRepo(login: string, repoName: string) {
    const repo: any = await fetchGithubRepo(login, repoName);
    const owner = repo.owner as { id: number; login: string; avatar_url?: string | null };
    const user = await prisma.githubUser.upsert({
      where: { id: owner.id },
      update: { login: owner.login, avatarUrl: owner.avatar_url ?? null },
      create: { id: owner.id, login: owner.login, avatarUrl: owner.avatar_url ?? null },
    });

    await prisma.githubRepo.upsert({
      where: { id: repo.id },
      update: {
        name: repo.name,
        description: repo.description ?? null,
        htmlUrl: repo.html_url,
        language: repo.language ?? null,
        createdAt: new Date(repo.created_at),
        userId: user.id,
      },
      create: {
        id: repo.id,
        name: repo.name,
        description: repo.description ?? null,
        htmlUrl: repo.html_url,
        language: repo.language ?? null,
        createdAt: new Date(repo.created_at),
        userId: user.id,
      },
    });

    return { synced: 1, user: user.login, repo: repo.name };
  }
  async listUserRepos(login: string) {
    const user = await prisma.githubUser.findUnique({ where: { login } });
    if (!user) return [];
    return prisma.githubRepo.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, description: true, htmlUrl: true, language: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchRepos(query: string) {
    const q = query.trim();
    if (!q) return [];
    return prisma.githubRepo.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { language: { contains: q } },
          { htmlUrl: { contains: q } },
        ],
      },
      select: { id: true, name: true, description: true, htmlUrl: true, language: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async stats(login?: string, topN = 5) {
    const n = Math.min(Math.max(topN, 1), 20);
    let repos: { id: number; language: string | null; createdAt: Date; userId: number }[] = [];
    let totalUsers = 0;
    if (login) {
      const user = await prisma.githubUser.findUnique({ where: { login } });
      if (!user) return { summary: { total_repos: 0 }, languages: {}, timeline_created_monthly: [] };
      repos = await prisma.githubRepo.findMany({ where: { userId: user.id }, select: { id: true, language: true, createdAt: true, userId: true } });
    } else {
      totalUsers = await prisma.githubUser.count();
      repos = await prisma.githubRepo.findMany({ select: { id: true, language: true, createdAt: true, userId: true } });
    }

    const summary: any = { total_repos: repos.length };
    if (!login) summary.total_users = totalUsers;

    const languages: Record<string, number> = {};
    for (const r of repos) {
      const lang = r.language || 'Unknown';
      languages[lang] = (languages[lang] || 0) + 1;
    }

    let top_users_by_repos: { user: string; repos: number }[] | undefined;
    if (!login) {
      const countsByUserId: Record<number, number> = {};
      for (const r of repos) countsByUserId[r.userId] = (countsByUserId[r.userId] || 0) + 1;
      const users = await prisma.githubUser.findMany({ where: { id: { in: Object.keys(countsByUserId).map(Number) } } });
      top_users_by_repos = users
        .map((u: { login: any; id: any; }) => ({ user: u.login, repos: countsByUserId[Number(u.id)] || 0 }))
        .sort((a: { repos: number; }, b: { repos: number; }) => b.repos - a.repos)
        .slice(0, n);
    }

    const timelineMap: Record<string, number> = {};
    for (const r of repos) {
      const d = r.createdAt;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      timelineMap[key] = (timelineMap[key] || 0) + 1;
    }
    const timeline_created_monthly = Object.entries(timelineMap)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([month, count]) => ({ month, count }));

    return { summary, languages, ...(login ? {} : { top_users_by_repos }), timeline_created_monthly };
  }
}