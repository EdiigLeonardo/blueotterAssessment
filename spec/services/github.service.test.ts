import { prisma } from '../mocks/prisma'
import { GithubService } from '../../src/services/github.service'

jest.mock('../../src/lib/githubApi', () => ({
  fetchGithubUser: async (login: string) => ({ id: 1, login, avatar_url: 'x' }),
  fetchAllRepos: async (_login: string) => [
    { id: 10, name: 'a', description: null, html_url: 'u', language: 'ts', created_at: new Date().toISOString() },
    { id: 20, name: 'b', description: null, html_url: 'u2', language: 'js', created_at: new Date().toISOString() },
  ],
  fetchGithubRepo: async (_owner: string, _repo: string) => ({
    id: 30,
    name: 'r',
    description: null,
    html_url: 'u3',
    language: 'ts',
    created_at: new Date().toISOString(),
    owner: { id: 2, login: 'owner', avatar_url: 'o' },
  }),
}))

describe('GithubService', () => {
  const svc = new GithubService()

  test('getUsers returns list', async () => {
    prisma.githubUser.findMany.mockResolvedValue([{ id: 1, login: 'a', avatarUrl: 'x' } as any])
    const users = await svc.getUsers()
    expect(users).toHaveLength(1)
  })

  test('syncUserRepos upserts and deletes missing', async () => {
    prisma.githubUser.upsert.mockResolvedValue({ id: 1, login: 'login' } as any)
    prisma.githubRepo.findMany.mockResolvedValue([{ id: 10 }, { id: 99 }] as any)
    prisma.githubRepo.upsert.mockResolvedValue({} as any)
    prisma.githubRepo.deleteMany.mockResolvedValue({ count: 1 } as any)

    const r = await svc.syncUserRepos('login')
    expect(r.synced).toBe(2)
    expect(r.created + r.updated).toBe(2)
    expect(r.deleted).toBe(1)
    expect(prisma.githubRepo.deleteMany).toHaveBeenCalled()
  })


  test('syncRepo upserts single repo', async () => {
    prisma.githubUser.upsert.mockResolvedValue({ id: 2, login: 'owner' } as any)
    prisma.githubRepo.upsert.mockResolvedValue({} as any)
    const r = await svc.syncRepo('owner', 'repo')
    expect(r).toMatchObject({ synced: 1, user: 'owner' })
  })

  test('searchRepos trims and returns [] when empty', async () => {
    const r = await svc.searchRepos('   ')
    expect(r).toEqual([])
  })
})
