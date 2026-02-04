# 1. Phase de BUILD (On compile le TypeScript)
FROM node:20-alpine AS builder
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Phase de RUN (Image finale ultra-légère)
FROM node:20-alpine
WORKDIR /backend
# On ne copie que ce qui est nécessaire pour exécuter
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist
# On installe uniquement les dépendances de prod (pas de TS, etc.)
RUN npm install --omit=dev

EXPOSE 3001
CMD ["node", "dist/index.js"]
