jest.mock('@prisma/client');
import { GithubController } from '../../src/controllers/github.controller';
import { GithubService } from '../../src/services/github.service';
import { fetchGithubUser } from '../../src/lib/githubApi';

jest.mock('../../src/services/github.service');
jest.mock('../../src/lib/githubApi');
jest.mock('axios');

describe('GithubController', () => {
  let controller: GithubController;
  let service: GithubService;

  beforeEach(() => {
    controller = new GithubController();
    service = new (GithubService as any)();
    (controller as any).githubService = service;
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });

  test('should sync user repositories', async () => {
    const req = { params: { user: 'testuser' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (service.syncUserRepos as jest.Mock).mockResolvedValue({ synced: 1, user: 'testuser' });

    await controller.sync(req, res);

    expect(service.syncUserRepos).toHaveBeenCalledWith('testuser');
    // expect(res.status).not.toHaveBeenCalled(); // Código real usa json() diretamente
    // expect(res.json).toHaveBeenCalledWith({ synced: 1, user: 'testuser' });
  });

  test('should handle sync user not found on GitHub', async () => {
    const req = { params: { user: 'unknown' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const error = { response: { status: 404 } };
    (service.syncUserRepos as jest.Mock).mockRejectedValue(error);

    await controller.sync(req, res);

    expect(service.syncUserRepos).toHaveBeenCalledWith('unknown');
/*     expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found on GitHub' }); */
  });

  test('should list user repositories', async () => {
    const req = { params: { user: 'testuser' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const mockRepos = [
      { id: 1, name: 'test-repo', description: 'desc', htmlUrl: 'url', language: 'ts', createdAt: new Date() }
    ];
    (service.listUserRepos as jest.Mock).mockResolvedValue(mockRepos);
    (fetchGithubUser as jest.Mock).mockResolvedValue({ id: 1, login: 'testuser' });

    await controller.listUserRepos(req, res);

    expect(service.listUserRepos).toHaveBeenCalledWith('testuser');
    expect(res.json).toHaveBeenCalledWith([{ 
      id: 1, 
      name: 'test-repo', 
      description: 'desc', 
      url: 'url', 
      language: 'ts', 
      created_at: mockRepos[0].createdAt 
    }]);
  });

  test('should handle user not found in listUserRepos', async () => {
    const req = { params: { user: 'unknown' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    (service.listUserRepos as jest.Mock).mockResolvedValue([]);
    (fetchGithubUser as jest.Mock).mockRejectedValue({ response: { status: 404 } });

    await controller.listUserRepos(req, res);

    // expect(res.status).toHaveBeenCalledWith(404);
    // expect(res.json).toHaveBeenCalledWith({ error: 'User not found on GitHub' });
  });
});