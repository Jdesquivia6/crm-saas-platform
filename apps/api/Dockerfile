FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
WORKDIR /app/apps/api
RUN npm install

COPY apps/api/prisma ./prisma/
RUN npx prisma generate

COPY apps/api ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
