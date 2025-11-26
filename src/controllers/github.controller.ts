import { Request, Response } from 'express';
import { GithubService } from '../services/github.service';
import axios from 'axios';
import { fetchGithubUser } from '../lib/githubApi';

export class GithubController {
  private service = new GithubService();

  users = async (req: Request, res: Response) => {
    console.debug({ controller: 'GithubController', action: 'users', route: req.originalUrl, method: req.method });
    const users = await this.service.getUsers();
    if(users){
      console.debug({ controller: 'GithubController', action: 'users_success', count: Array.isArray(users) ? users.length : 0 });
      res.json(users);
    } else {
      res.json([])
    }
  }
  sync = async (req: Request, res: Response) => {
    const login = req.params.user;
    console.debug({ controller: 'GithubController', action: 'sync_start', params: req.params });
    const users = await this.service.getUsers();
    try {
      const result = await this.service.syncUserRepos(login);
      console.debug({ controller: 'GithubController', action: 'sync_success', login });
      res.json(result);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'User not found on GitHub' });
      }
      res.status(500).json({ error: 'Failed to sync user repositories' });
    }
  };

  listUserRepos = async (req: Request, res: Response) => {
    const login = req.params.user;
    console.debug({ controller: 'GithubController', action: 'listUserRepos_start', params: req.params });
    try {
      const repos = await this.service.listUserRepos(login);
      if (!repos || repos.length === 0) {
        try {
          await fetchGithubUser(login);
          return res.status(404).json({
            error: 'User exists on GitHub but is not synced locally. Please run POST /github/sync/:user first.',
          });
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            return res.status(404).json({ error: 'User not found on GitHub' });
          }
          return res.status(500).json({ error: 'Failed to verify user on GitHub' });
        }
      }
      const payload = repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.htmlUrl,
        language: r.language,
        created_at: r.createdAt,
      }));
      console.debug({ controller: 'GithubController', action: 'listUserRepos_success', count: payload.length });
      res.json(payload);
    } catch (err) {
      res.status(500).json({ error: 'Failed to list repositories' });
    }
  };

  searchRepos = async (req: Request, res: Response) => {
    const query = String((req.query.query ?? req.query.q ?? '') as string);
    console.debug({ controller: 'GithubController', action: 'searchRepos_start', query: req.query });
    try {
      const repos = await this.service.searchRepos(query);
      const payload = repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.htmlUrl,
        language: r.language,
        created_at: r.createdAt,
      }));
      console.debug({ controller: 'GithubController', action: 'searchRepos_success', count: payload.length });
      res.json(payload);
    } catch (err) {
      res.status(500).json({ error: 'Failed to search repositories' });
    }
  };

  stats = async (req: Request, res: Response) => {
    const login = req.query.user ? String(req.query.user) : undefined;
    const topN = Number(req.query.topN) || 5;
    console.debug({ controller: 'GithubController', action: 'stats_start', query: req.query });
    try {
      const result = await this.service.stats(login, topN);
      console.debug({ controller: 'GithubController', action: 'stats_success' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to compute stats' });
    }
  };

  syncRepo = async (req: Request, res: Response) => {
    const login = req.params.user;
    const repoName = req.params.repo;
    console.debug({ controller: 'GithubController', action: 'syncRepo_start', params: req.params });
    try {
      const result = await this.service.syncRepo(login, repoName);
      console.debug({ controller: 'GithubController', action: 'syncRepo_success' });
      res.json(result);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'Repository not found on GitHub' });
      }
      res.status(500).json({ error: 'Failed to sync repository' });
    }
  };
}
