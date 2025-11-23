import request from 'supertest'
import { createApp } from '../../src/app'
import { prisma } from '../mocks/prisma'

jest.mock('../../src/lib/githubApi', () => ({
  fetchGithubUser: async (login: string) => ({ id: 1, login, avatar_url: 'x' }),
  fetchAllRepos: async (_login: string) => [],
  fetchGithubRepo: async (_owner: string, _repo: string) => ({ id: 30, name: 'r', owner: { id: 2, login: 'owner' } }),
}))

describe('GithubController routes', () => {
  const app = createApp()

  test('GET /github/users returns users', async () => {
    prisma.githubUser.findMany.mockResolvedValue([{ id: 1, login: 'a' } as any])
    const res = await request(app).get('/github/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  test('POST /github/sync/:user returns sync summary', async () => {
    prisma.githubUser.upsert.mockResolvedValue({ id: 1, login: 'a' } as any)
    prisma.githubRepo.findMany.mockResolvedValue([] as any)
    prisma.githubRepo.upsert.mockResolvedValue({} as any)
    const res = await request(app).post('/github/sync/octocat')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('user')
  })

  test('GET /github/:user/repos returns 404 when only on GitHub', async () => {
    prisma.githubUser.findUnique.mockResolvedValue(null as any)
    const res = await request(app).get('/github/octocat/repos')
    expect(res.status).toBe(404)
  })

  test('GET /github/search returns list', async () => {
    prisma.githubRepo.findMany.mockResolvedValue([
      { id: 1, name: 'a', description: null, htmlUrl: 'u', language: 'ts', createdAt: new Date() } as any,
    ])
    const res = await request(app).get('/github/search').query({ query: 'a' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })
})
