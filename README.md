# GitHub Backend Challenge (Node.js + Express + TypeScript + Prisma/PostgreSQL)

This project implements a simple, professional API to interact with and store GitHub user repository data locally. It was built from scratch, separate from any existing projects, using Node.js, Express, TypeScript, Prisma (PostgreSQL), and Axios.

## Features

- Sync public repositories of a GitHub user into a local PostgreSQL database
- List stored repositories for a given user
- Search stored repositories by text
- Compute statistics from locally stored data (global or per user)
- CORS enabled

## Tech Stack

 - Backend: Node.js, Express, TypeScript, Prisma ORM
 - Database (dev): SQLite via Prisma
 - Frontend: React, Vite, TailwindCSS, TypeScript
 - Axios (HTTP client)

## Project Structure

```
github-backend/
├── .env
├── package.json
├── prisma/
│   ├── dev.db
│   ├── migrations/
│   └── schema.prisma
├── frontend/
│   ├── src/
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── tailwind.config.js
├── src/
│   ├── app.ts              # Express app setup (middlewares, routes)
│   ├── server.ts           # Server bootstrap (entry point)
│   ├── db/
│   │   └── prisma.ts       # PrismaClient instance (singleton)
│   ├── lib/
│   │   └── githubApi.ts    # GitHub API integration (user + repos with pagination)
│   ├── services/
│   │   └── github.service.ts # Business logic (sync, list, search, stats)
│   ├── controllers/
│   │   └── github.controller.ts # HTTP handlers delegating to service
│   └── routes/
│       ├── index.ts        # Root router
│       └── github.routes.ts# GitHub endpoints
└── tsconfig.json
```

## Data Model

Prisma models (see `prisma/schema.prisma`):

```
model GithubUser {
  id        Int         @id
  login     String      @unique
  avatarUrl String?
  repos     GithubRepo[]
}

model GithubRepo {
  id         Int       @id
  name       String
  description String?
  htmlUrl    String
  language   String?
  createdAt  DateTime
  userId     Int
  user       GithubUser @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

## Setup

Prerequisites:
- Node.js 18+ for backend development (frontend runs in Docker if your Node < 20.19)

Steps:
1) Install dependencies
```
npm install
```
2) Configure environment
```
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blueotter?schema=public"
```
3) Initialize database (generate client + apply migrations)
```
npx prisma generate
npx prisma migrate dev --name init
```
4) Run in development (backend)
```
npm run dev
# Server: http://localhost:3000
```

Build and run:
```
npm run build
npm run start
```

## API Reference

Base URL: `http://localhost:3000`

### Health
GET `/`
Response:
```
{ "status": "ok" }
```

### Endpoint 1: Sync user repositories
- ## EdiigLeonardo
POST `/github/sync/:user`
- Copies all public repositories from GitHub to local DB.
- Stores: repo id, name, description, URL, main language, createdAt; plus user id, login, avatar.

Example:
```
curl -i -X POST http://localhost:3000/github/sync/octocat
```
Response:
```
{ "synced": 8, "user": "octocat" }
```

### Novo Endpoint: Sync de um único repositório (verificação prévia na API do GitHub)
POST `/github/sync/:user/:repo`
- Verifica na API do GitHub se o repositório `:repo` do usuário `:user` existe.
- Se existir, grava/atualiza esse repositório e o usuário correspondente na base local.

Exemplo:
```
curl -i -X POST http://localhost:3000/github/sync/octocat/Hello-World
```
Resposta:
```
{ "synced": 1, "user": "octocat", "repo": "Hello-World" }
```

Fluxo recomendado (conforme sugestão):
- Antes de considerar um repositório “válido” localmente, use o endpoint acima para validar a existência no GitHub e sincronizá-lo. (`/github/sync/:user/`)
- Em seguida, os endpoints de listagem, busca e estatísticas operam apenas sobre dados locais já sincronizados.

### Endpoint 2: List stored repositories of a user
GET `/github/:user/repos`
Returns locally stored repositories for the given user.

Example:
```
curl -sS -H "Accept: application/json" http://localhost:3000/github/octocat/repos | jq
```
Response (fields):
```
[
  {
    "id": number,
    "name": string,
    "description": string | null,
    "url": string,
    "language": string | null,
    "created_at": string (ISO)
  }, ...
]
```

### Endpoint 3: Search repositories
GET `/github/search?query=...`
Search fields: name, description, language, htmlUrl.

Example:
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/search?query=repo" | jq
```

### Endpoint 4: Statistics
GET `/github/stats[?user=login&topN=5]`
- If `user` is absent: global stats across all stored users.
- If `user` is present: stats only for that user.
- `topN`: optional, default 5, max 20 (applies to global top users).

Response:
```
{
  "summary": {
    "total_repos": number,
    "total_users": number  // only global
  },
  "languages": { [language: string]: count },
  "top_users_by_repos": [ { "user": string, "repos": number } ], // only global
  "timeline_created_monthly": [ { "month": "YYYY-MM", "count": number } ]
}
```

Examples:
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/stats" | jq
curl -sS -H "Accept: application/json" "http://localhost:3000/github/stats?user=octocat&topN=3" | jq
```

## Frontend

- Framework: React + Vite + TailwindCSS + TypeScript.
- Dev server: `http://localhost:3001`.
- Checagem de saúde do backend: botão em `frontend/src/App.tsx` consulta `GET /` e exibe `status`.
- Configuração do Vite (host/porta): `frontend/vite.config.ts`.

Build local (requer Node >= 20.19):
```
cd frontend
npm run build
```

## CORS

CORS is enabled for all origins by default. Adjust in `src/app.ts` if you need restrictions.

## Notes & Limitations

- GitHub API rate limits apply. For heavy usage, consider using a GitHub Personal Access Token.
- SQLite text search is case-sensitive by default in this implementation (removed `mode: 'insensitive'` for compatibility).
- Sync operation performs upsert per repository; repeated syncs update fields.

## Troubleshooting

- "User not found on GitHub" (404): Check the username.
- Rate limits exceeded: Wait or use a token.
- Database issues: Ensure `.env` is set and migrations ran.

## Dica: obter respostas em JSON formatado

Os endpoints retornam JSON. Para ver a saída legível no terminal:
- Adicione o header `Accept: application/json` nas requisições `curl`.
- Remova `-i` (que imprime cabeçalhos junto com o corpo) e use `-sS` para saída silenciosa com erros.
- Faça pipe para o `jq` para pretty-print: `| jq`.

Exemplo geral:
```
curl -sS -H "Accept: application/json" http://localhost:3000/github/stats | jq
```
Se estiver rodando via Docker Compose, substitua a porta por `3001` (ex.: `http://localhost:3001/...`).

## Development Scripts

```
npm run dev    # Development (ts-node-dev)
npm run studio # Open Prisma Studio at http://localhost:5555 (no auto browser)
npm run dev:studio # Run API (dev) and Prisma Studio concurrently
npm run build  # Compile TypeScript to dist/
npm run start  # Run compiled JS
```

## Future Improvements

- Dockerfile / Docker Compose for one-command startup
- Add GitHub authentication (PAT) to increase rate limits
- Scheduled sync jobs
- Pagination and caching strategies
- Indexes for faster search

## License

MIT

## Casos de teste (endpoints)

Assumindo que o servidor está rodando em `http://localhost:3000` (conforme `PORT` no `.env`). Ajuste a porta nos comandos se necessário.

Observação sobre formato de dados retornados pelos endpoints de repositórios (listar e buscar):
- Campos: `id`, `name`, `description`, `url`, `language`, `created_at`
- `created_at` é uma string ISO e corresponde ao campo `createdAt` no banco.
- `url` corresponde a `htmlUrl` no banco.

1) Saúde do servidor

Comando:
```
curl -sS -H "Accept: application/json" http://localhost:3000/ | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
{ "status": "ok" }
```

2) Sync dos repositórios de um usuário (Endpoint 1)

- Caso A (usuário existente):
```
curl -sS -X POST -H "Accept: application/json" http://localhost:3000/github/sync/octocat | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
{ "synced": <numero>, "user": "octocat" }
```

- Caso B (usuário inexistente):
```
curl -sS -X POST -H "Accept: application/json" http://localhost:3000/github/sync/usuario_que_nao_existe | jq
```
Resultado esperado:
```
HTTP/1.1 404 Not Found
{ "error": "User not found on GitHub" }
```

- Caso C (idempotência): repetir o sync para o mesmo usuário não duplica registros; atualiza campos se necessário.

3) Sync de um único repositório (verificação na API do GitHub)

Comando:
```
curl -sS -X POST -H "Accept: application/json" http://localhost:3000/github/sync/octocat/Hello-World | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
{ "synced": 1, "user": "octocat", "repo": "Hello-World" }
```

3) Listar repositórios armazenados de um usuário (Endpoint 2)

Pré-condição: executar o sync do usuário primeiro.

Comando:
```
curl -sS -H "Accept: application/json" http://localhost:3000/github/octocat/repos | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
[
  {
    "id": number,
    "name": string,
    "description": string | null,
    "url": string,
    "language": string | null,
    "created_at": string
  },
  ...
]
```
- Ordenação: desc por `created_at`.
- Usuário não sincronizado: retorna `[]`.

4) Buscar repositórios na base local (Endpoint 3)

- Com `query`:
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/search?query=repo" | jq
```
- Com `q` (parâmetro alternativo aceito):
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/search?q=repo" | jq
```
Resultado esperado (mesma forma do Endpoint 2):
```
HTTP/1.1 200 OK
[
  {
    "id": number,
    "name": string,
    "description": string | null,
    "url": string,
    "language": string | null,
    "created_at": string
  },
  ...
]
```
- Consulta vazia (`query=""` ou `q=""`): retorna `[]`.

5) Estatísticas (Endpoint 4)

- Global (sem `user`):
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/stats" | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
{
  "summary": { "total_repos": number, "total_users": number },
  "languages": { "<linguagem>": count, ... },
  "top_users_by_repos": [ { "user": string, "repos": number }, ... ],
  "timeline_created_monthly": [ { "month": "YYYY-MM", "count": number }, ... ]
}
```

- Global com `topN=3`:
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/stats?topN=3" | jq
```

- Estatística por usuário:
```
curl -sS -H "Accept: application/json" "http://localhost:3000/github/stats?user=octocat&topN=3" | jq
```
Resultado esperado:
```
HTTP/1.1 200 OK
{
  "summary": { "total_repos": number },
  "languages": { "<linguagem>": count, ... },
  "timeline_created_monthly": [ { "month": "YYYY-MM", "count": number }, ... ]
}
```

## Docker (Dev)

Levanta dois serviços: backend (Express) e frontend (Vite). Útil especialmente quando sua versão local do Node é < 20.19 (requisito do Vite 7).

- Comando único:
```
npm run docker:dev
```
- URLs:
  - Backend: `http://localhost:3000/`
  - Frontend: `http://localhost:3001/`
- Parar:
```
npm run docker:down
```
- Logs (backend):
```
npm run docker:logs
```

Notas:
- O serviço `frontend` usa `node:22-alpine` para satisfazer o requisito de versão do Vite.
- O serviço `app` compila e inicia a API com SQLite (`DATABASE_URL="file:./dev.db"`).
- Variáveis do frontend: use `VITE_API_BASE_URL` para apontar o backend (já definido como `http://localhost:3000` no compose).

Variáveis relevantes:
- `VITE_API_BASE_URL`: base da API consumida pelo frontend.

6) Robustez de porta (opcional)

Para validar o comportamento do servidor frente a um `PORT` inválido no `.env`:
```
# NÃO FAÇA EM PRODUÇÃO. Somente para teste.
# .env (exemplo inválido)
PORT="http://localhost:3000"
```
Resultado esperado ao iniciar:
- O servidor emite um aviso no console indicando `PORT inválido` e usa a porta de fallback `3003`.
- A saúde deve responder em `http://localhost:3003/`:
```
curl -i http://localhost:3003/
```
