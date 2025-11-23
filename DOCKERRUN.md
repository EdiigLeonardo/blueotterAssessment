# Instruções para Rodar o Projeto no Docker

Este documento explica como configurar e rodar o projeto GitHub Backend no Docker usando o Dockerfile e docker-compose.yml existentes. Certifique-se de ter o Docker e Docker Compose instalados.

## Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js e npm para builds locais (opcional).
- Arquivo `.env` com variáveis como `DATABASE_URL` (ex: `postgres://user:password@db:5432/githubdb`).
- Rode `npm install` localmente se necessário.

## Estrutura dos Arquivos
- **Dockerfile**: Configuração multi-stage para build e produção.
- **docker-compose.yml**: Orquestra a app (Node.js) e o banco (PostgreSQL).
- **package.json**: Scripts npm para gerenciar Docker (ex: `npm run docker:up`).

## Passos para Rodar

1. **Buildar as Imagens**:
   ```
   npm run docker:build
   ```
   Isso builda a imagem da app usando o Dockerfile.

2. **Subir os Containers** (app + db):
   ```
   npm run docker:up
   ```
   - A app roda na porta 3000 (acesso: http://localhost:3000).
   - O banco PostgreSQL roda na porta 5432.

3. **Subir Apenas a App** (se db já estiver up):
   ```
   npm run docker:app
   ```

4. **Aplicar Migrações Prisma** (dentro do container):
   ```
   npm run docker:exec
   ```
   No shell do container, rode:
   ```
   npx prisma migrate deploy
   ```

5. **Ver Logs da App**:
   ```
   npm run docker:logs
   ```

6. **Parar os Containers**:
   ```
   npm run docker:down
   ```

## Troubleshooting
- **Erro de Conexão ao Banco**: Verifique `DATABASE_URL` no `.env` e reinicie.
- **Build Falha**: Rode `npm run build` localmente para testar.
- **Portas Ocupadas**: Ajuste `ports` no docker-compose.yml.
- **Persistência de Dados**: O volume `postgres-data` mantém os dados do banco.

Para mais detalhes, consulte o Dockerfile ou docker-compose.yml. Se precisar de ajuda, teste rotas como `/github/sync/testuser` após subir.