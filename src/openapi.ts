export const openapi: any = {
  openapi: '3.0.0',
  info: {
    title: 'GitHub Sync API',
    version: '1.0.0',
    description: 'API to sync GitHub users and repositories',
  },
  servers: [{ url: '/' }],
  paths: {
    '/': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } } } } },
          },
        },
      },
    },
    '/github/users': {
      get: {
        summary: 'List synced users',
        responses: {
          '200': {
            description: 'Users',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GithubUser' } } } },
          },
        },
      },
    },
    '/github/sync/{user}': {
      post: {
        summary: 'Sync all repositories of a user',
        parameters: [{ name: 'user', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Sync summary', content: { 'application/json': { schema: { $ref: '#/components/schemas/SyncSummary' } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/github/sync/{user}/{repo}': {
      post: {
        summary: 'Sync a single repository',
        parameters: [
          { name: 'user', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'repo', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Sync summary', content: { 'application/json': { schema: { $ref: '#/components/schemas/SyncRepoSummary' } } } },
          '404': { description: 'Repository or user not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/github/{user}/repos': {
      get: {
        summary: 'List repositories for a user',
        parameters: [{ name: 'user', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Repositories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RepoItem' } } } } },
          '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/github/search': {
      get: {
        summary: 'Search repositories',
        parameters: [{ name: 'query', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Repositories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RepoItem' } } } } },
        },
      },
    },
    '/github/stats': {
      get: {
        summary: 'Statistics for repos/users',
        parameters: [
          { name: 'user', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'topN', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 20 } },
        ],
        responses: {
          '200': { description: 'Stats', content: { 'application/json': { schema: { $ref: '#/components/schemas/StatsResponse' } } } },
        },
      },
    },
  },
  components: {
    schemas: {
      GithubUser: {
        type: 'object',
        properties: { id: { type: 'integer' }, login: { type: 'string' }, avatarUrl: { type: 'string', nullable: true } },
        required: ['id', 'login'],
      },
      RepoItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          url: { type: 'string' },
          language: { type: 'string', nullable: true },
          created_at: { type: 'string' },
        },
        required: ['id', 'name', 'url', 'created_at'],
      },
      SyncSummary: {
        type: 'object',
        properties: { synced: { type: 'integer' }, user: { type: 'string' }, created: { type: 'integer' }, updated: { type: 'integer' }, deleted: { type: 'integer' } },
        required: ['synced', 'user'],
      },
      SyncRepoSummary: {
        type: 'object',
        properties: { synced: { type: 'integer' }, user: { type: 'string' }, repo: { type: 'string' } },
        required: ['synced', 'user', 'repo'],
      },
      Error: { type: 'object', properties: { error: { type: 'string' } }, required: ['error'] },
      StatsResponse: {
        type: 'object',
        properties: {
          summary: { type: 'object', additionalProperties: true },
          languages: { type: 'object', additionalProperties: { type: 'integer' } },
          top_users_by_repos: { type: 'array', items: { type: 'object', properties: { user: { type: 'string' }, repos: { type: 'integer' } } } },
          timeline_created_monthly: { type: 'array', items: { type: 'object', properties: { month: { type: 'string' }, count: { type: 'integer' } } } },
        },
      },
    },
  },
}
