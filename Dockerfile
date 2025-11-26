FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
RUN npx prisma migrate

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --omit dev
COPY prisma ./prisma
RUN npx prisma generate
RUN npx prisma migrate
EXPOSE 3000
CMD ["node", "dist/server.js"]
