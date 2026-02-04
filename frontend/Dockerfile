# 1. Phase de BUILD
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Phase de RUN (On utilise Nginx pour servir les fichiers statiques)
FROM nginx:stable-alpine
# On copie le dossier de build (souvent 'dist' avec Vite) vers le dossier HTML de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# On expose le port 80 (standard pour Nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]