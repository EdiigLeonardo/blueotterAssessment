#!/bin/sh
set -e
npx prisma generate
npx prisma migrate deploy
npm run build
node dist/server.js