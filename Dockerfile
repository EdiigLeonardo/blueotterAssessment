# ===== DEPENDENCIES STAGE =====
FROM node:18-alpine AS deps
WORKDIR /app

# Copia arquivos necessários para instalar dependências
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

# ===== BUILD STAGE =====
FROM node:18-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# ===== RUNTIME STAGE =====
FROM node:18-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package.json .

CMD ["node", "dist/main.js"]
