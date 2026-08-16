FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/
WORKDIR /app/apps/web
RUN npm install

COPY apps/web ./
RUN npm run build

FROM nginx:alpine
COPY --from=base /app/apps/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
