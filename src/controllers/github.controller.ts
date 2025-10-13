import { Request, Response } from 'express';
import { GithubService } from '../services/github.service';
import axios from 'axios';
import { fetchGithubUser } from '../lib/githubApi';

export class GithubController {
  private service = new GithubService();

  sync = async (req: Request, res: Response) => {
    const login = req.params.user;
    try {
      const result = await this.service.syncUserRepos(login);
      res.json(result);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'User not found on GitHub' });
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to sync user repositories' });
    }
  };

  listUserRepos = async (req: Request, res: Response) => {
    const login = req.params.user;
    try {
      const repos = await this.service.listUserRepos(login);
      // Se não há dados locais, verifique existência do usuário na API do GitHub
      if (!repos || repos.length === 0) {
        try {
          await fetchGithubUser(login);
          // Usuário existe no GitHub, mas não está sincronizado localmente
          return res.status(404).json({
            error: 'User exists on GitHub but is not synced locally. Please run POST /github/sync/:user first.',
          });
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            return res.status(404).json({ error: 'User not found on GitHub' });
          }
          console.error(err);
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
      res.json(payload);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to list repositories' });
    }
  };

  searchRepos = async (req: Request, res: Response) => {
    const query = String((req.query.query ?? req.query.q ?? '') as string);
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
      res.json(payload);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to search repositories' });
    }
  };

  stats = async (req: Request, res: Response) => {
    const login = req.query.user ? String(req.query.user) : undefined;
    const topN = Number(req.query.topN) || 5;
    try {
      const result = await this.service.stats(login, topN);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to compute stats' });
    }
  };

  syncRepo = async (req: Request, res: Response) => {
    const login = req.params.user;
    const repoName = req.params.repo;
    try {
      const result = await this.service.syncRepo(login, repoName);
      res.json(result);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'Repository not found on GitHub' });
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to sync repository' });
    }
  };
}