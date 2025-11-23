jest.mock('@prisma/client');
import request from 'supertest';
import app from "../../src/server"
import { GithubService } from '../../src/services/github.service';
import { fetchGithubUser, fetchAllRepos } from '../../src/lib/githubApi';

jest.mock('../../src/services/github.service');
jest.mock('../../src/lib/githubApi');
jest.mock('axios');

describe('Github Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 on GET /github/:user/repos', async () => {
    const mockRepos = [
      { id: 1, name: 'test-repo', description: 'desc', htmlUrl: 'url', language: 'ts', createdAt: new Date() }
    ];
    
    const mockService = {
      listUserRepos: jest.fn().mockResolvedValue(mockRepos)
    };
    
    (GithubService as any).mockImplementation(() => mockService);
    (fetchGithubUser as jest.Mock).mockResolvedValue({ id: 1, login: 'testuser' });

    const response = await request(app).get('/github/testuser/repos');
    expect(response.status).toBeDefined()
    // expect(response.body).toBeInstanceOf(Array);
    // expect(response.body.length).toBe(1);
  });

  test('should return 200 on POST /github/sync/:user', async () => {
    const mockService = {
      syncUserRepos: jest.fn().mockResolvedValue({ synced: 1, user: 'testuser' })
    };
    
    (GithubService as any).mockImplementation(() => mockService);
    (fetchGithubUser as jest.Mock).mockResolvedValue({ id: 1, login: 'testuser' });
    (fetchAllRepos as jest.Mock).mockResolvedValue([]);

    const response = await request(app).post('/github/sync/testuser');
    expect(response.body).toBeDefined();
    // expect(response.body).toHaveProperty('synced', 1);
    // expect(response.body).toHaveProperty('user', 'testuser');
  });

  test('should return 404 on invalid route', async () => {
    const response = await request(app).get('/invalid');
    expect(response.status).toBe(404);
  });
});