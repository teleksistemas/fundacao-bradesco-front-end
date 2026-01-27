# ---------- ETAPA DE BUILD ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN npm install

COPY . .

RUN npm run build

# ---------- ETAPA DE SERVIR ----------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

# Config para SPA (React Router / Vite Router)
RUN echo 'server { \
  listen 4174; \
  server_name _; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 4174

CMD ["nginx", "-g", "daemon off;"]
