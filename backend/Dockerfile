# 1. Phase de BUILD
FROM node:20-alpine AS builder
WORKDIR /backend

COPY package*.json ./
COPY prisma ./prisma/
# On installe TOUT pour builder
RUN npm install

COPY . .
# On génère le client Prisma AVANT le build NestJS
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build

# 2. Phase de RUN
FROM node:20-alpine
WORKDIR /backend

# On définit l'environnement de production
ENV NODE_ENV=production

# On ne copie QUE ce qui est nécessaire
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/prisma ./prisma
# On copie TOUS les node_modules du builder (plus sûr et plus rapide)
COPY --from=builder /backend/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/main.js"]