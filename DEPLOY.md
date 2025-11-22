# DEPLOY

Guia de deploy dos containers de `app` (backend Express) e `frontend` (Vite/React) em plataformas comuns.

## Visão Geral

- `app` (backend): Node.js/Express, porta `3000`, já bindando em `0.0.0.0` (veja `src/server.ts`).
- `frontend`: Vite/React + Tailwind. Em produção, recomenda‑se servir estático (ex.: Nginx) após `npm run build`.
- Variáveis:
  - `VITE_API_BASE_URL`: URL pública do backend utilizada pelo frontend.
  - `DATABASE_URL`: por padrão `file:./dev.db` (SQLite). Para produção, considere usar um banco gerenciado (ex.: Postgres) e ajustar essa URL.

## Imagens Docker (produção)

Você pode usar os exemplos abaixo como base para suas imagens.

### Backend (app)

```
# Dockerfile (app)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit dev
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Notas:
- Se usar Prisma + Postgres em produção, rode `npx prisma migrate deploy` (via entrypoint ou init container) antes de subir o app.
- Para SQLite, assegure volume persistente (não recomendado para produção sem redundância).

### Frontend

```
# Dockerfile (frontend)
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM nginx:alpine AS run
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Notas:
- Configure `VITE_API_BASE_URL` na etapa de build ou em tempo de execução via mecanismos de injeção (vercel.json, env do serviço, etc.).
- Vite produz arquivos estáticos em `dist/`.

## Vercel

- Vercel não executa containers de backend tradicionais; é voltado a sites estáticos e funções serverless.
- Estratégia recomendada:
  - Deploy do `frontend` como projeto Vite estático.
  - Backend `app` deve ser hospedado em outra plataforma (ex.: Render, Railway, Fly.io, Cloud Run, ECS) e exposto publicamente.
  - Em `Vercel`, defina `VITE_API_BASE_URL` apontando para a URL pública do backend.

Passos (frontend):
- Project Settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variables: `VITE_API_BASE_URL=https://SEU_BACKEND_URL`

## Google Cloud Run

Requisitos: `gcloud` autenticado e projeto selecionado.

Backend (`app`):
```
gcloud builds submit --tag gcr.io/SEU_PROJETO/app:latest .
gcloud run deploy app \
  --image gcr.io/SEU_PROJETO/app:latest \
  --platform managed \
  --region us-central1 \
  --port 3000 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=file:./dev.db
```

Frontend:
```
gcloud builds submit --tag gcr.io/SEU_PROJETO/frontend:latest ./frontend
gcloud run deploy frontend \
  --image gcr.io/SEU_PROJETO/frontend:latest \
  --platform managed \
  --region us-central1 \
  --port 80 \
  --allow-unauthenticated
```

Depois, ajuste `VITE_API_BASE_URL` no build do frontend para a URL do serviço `app` no Cloud Run.

## Render

- Crie dois serviços: `Web Service` para backend (porta 3000) e `Static Site` ou `Web Service` com Nginx para frontend.
- Usando Docker:
  - Selecione “Use Docker” e Render detecta seu `Dockerfile`.
  - Configure env `DATABASE_URL` (app) e `VITE_API_BASE_URL` (frontend).

## Railway

- Crie dois serviços (backend e frontend) a partir do repositório.
- Se usar Docker, habilite “Deploy with Dockerfile”.
- Configure envs: `DATABASE_URL` (app) e `VITE_API_BASE_URL` (frontend).

## Fly.io

- Inicialize apps separados (`fly launch`) para backend e frontend.
- Configure portas: backend 3000, frontend 80.
- Defina envs e volumes (se for persistir SQLite, crie um volume). Em produção, prefira Postgres gerenciado.

## AWS ECS Fargate (alto nível)

- Crie duas Task Definitions (app e frontend) com as imagens docker.
- Configure o `ContainerPort` (app: 3000, frontend: 80).
- Use um `Application Load Balancer` com dois target groups ou subdomínios diferentes.
- Defina envs: `DATABASE_URL`, `VITE_API_BASE_URL`.

## Docker Compose (VM)

Exemplo simples para produção numa VM (Nginx + app):

```
services:
  app:
    image: gcr.io/SEU_PROJETO/app:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: "file:./dev.db"
    ports:
      - "3000:3000"

  frontend:
    image: gcr.io/SEU_PROJETO/frontend:latest
    restart: unless-stopped
    ports:
      - "80:80"
```

## Boas Práticas

- Não use SQLite em produção sem persistência/backup; prefira Postgres.
- Não exponha segredos em logs ou repositórios.
- Habilite HTTPS (Cloud Run, Render, Railway, Vercel já fornecem TLS).
- Monitoramento: configure health checks (backend responde `GET /` com `{ status: 'ok' }`).

## Debug Rápido

- Backend não abre? Verifique porta/host: o app escuta `0.0.0.0:3000`.
- CORS: já está habilitado no backend; ajuste se necessário.
- Frontend não consegue chamar API? Cheque `VITE_API_BASE_URL` e CORS.