# 1. Phase de BUILD (linux/amd64 pour Apple Silicon)
FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /backend
COPY package*.json ./
# On copie aussi le dossier prisma pour la génération du client
COPY prisma ./prisma/ 
RUN npm install
COPY . .
# Génère le client Prisma (indispensable avant le build TS)
RUN npx prisma generate
RUN npm run build

# 2. Phase de RUN
FROM --platform=linux/amd64 node:20-alpine
WORKDIR /backend

# On a besoin du moteur Prisma (Query Engine) en prod
COPY --from=builder /backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /backend/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist

# On installe les dépendances de prod
RUN npm install --omit=dev

EXPOSE 8080

CMD ["node", "dist/main.js"]