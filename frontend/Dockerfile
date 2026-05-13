# 1. Phase de BUILD (linux/amd64 pour Apple Silicon)
FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build --mode production

# 2. Phase de RUN (On utilise Nginx pour servir les fichiers statiques)
FROM --platform=linux/amd64 nginx:stable-alpine
# On copie le dossier de build (souvent 'dist' avec Vite) vers le dossier HTML de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Config Nginx qui écoute sur 0.0.0.0:8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]