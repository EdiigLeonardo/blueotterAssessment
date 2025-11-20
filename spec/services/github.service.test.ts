import { GithubService } from '../../src/services/github.service';
import { fetchGithubUser, fetchAllRepos } from '../../src/lib/githubApi';
import { prismaMock } from '../singleton';

jest.mock('@prisma/client');
jest.mock('../../src/lib/githubApi');
jest.mock('axios');

describe('GithubService', () => {
  let service: GithubService;
  beforeEach(() => {
    service = new GithubService();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should sync user and repositories', async () => {
    const mockUser = { id: 1, login: 'testuser', avatar_url: 'http://avatar.com' };
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'test description',
        html_url: 'http://test.com',
        language: 'typescript',
        created_at: '2023-01-01T00:00:00Z',
      }
    ];

    (fetchGithubUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAllRepos as jest.Mock).mockResolvedValue(mockRepos);

    prismaMock.githubUser.upsert.mockResolvedValue({ id: 1, login: 'testuser', avatarUrl: 'http://avatar.com' });
    prismaMock.githubRepo.upsert.mockResolvedValue({ id: 1, name: 'test-repo', userId: 1 });

    const result = await service.syncUserRepos('testuser');

    expect(fetchGithubUser).toHaveBeenCalledWith('testuser');
    expect(fetchAllRepos).toHaveBeenCalledWith('testuser');
    expect(prismaMock.githubUser.upsert).toHaveBeenCalled();
    expect(prismaMock.githubRepo.upsert).toHaveBeenCalled();
    expect(result).toEqual({ synced: 1, user: 'testuser' });
  });

  test('should handle user not found on GitHub', async () => {
    (fetchGithubUser as jest.Mock).mockRejectedValue({ response: { status: 404 } });
    expect(fetchGithubUser).toHaveBeenCalledWith('unknown');
  });

  test('should list user repositories', async () => {
    const mockUser = { id: 1, login: 'testuser', avatarUrl: 'http://avatar.com' };
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'test description',
        htmlUrl: 'http://test.com',
        language: 'typescript',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      }
    ];

    prismaMock.githubUser.findUnique.mockResolvedValue(mockUser);
    prismaMock.githubRepo.findMany.mockResolvedValue(mockRepos);

    const result = await service.listUserRepos('testuser');

    expect(prismaMock.githubUser.findUnique).toHaveBeenCalledWith({ where: { login: 'testuser' } });
    expect(prismaMock.githubRepo.findMany).toHaveBeenCalledWith({
      where: { userId: mockUser.id },
      select: { id: true, name: true, description: true, htmlUrl: true, language: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(mockRepos);
  });

  test('should return empty array for non-existent user', async () => {
    prismaMock.githubUser.findUnique.mockResolvedValue(null);

    const result = await service.listUserRepos('unknown');

    expect(prismaMock.githubUser.findUnique).toHaveBeenCalledWith({ where: { login: 'unknown' } });
    expect(result).toEqual([]);
  });
});