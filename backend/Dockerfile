# --- 1. Phase de BUILD ---
FROM node:20-alpine AS builder

# Installation de libc6-compat pour Prisma sur Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /backend

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Génération du client Prisma et build NestJS
RUN npx prisma generate
RUN npm run build

# --- 2. Phase de RUN ---
FROM node:20-alpine
WORKDIR /backend

# Re-installation de libc6-compat pour l'exécution
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

# On récupère les fichiers nécessaires du builder
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/prisma ./prisma
COPY --from=builder /backend/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/main.js"]