# 1. Phase de BUILD
FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /backend

COPY package*.json ./
# On installe tout (y compris devDeps pour builder Nest et Prisma)
RUN npm install

# ON COPIE TOUT ICI (pour avoir prisma.config.ts et le code source)
COPY . .

# Génère le client Prisma (il trouvera prisma.config.ts maintenant)
RUN npx prisma generate
RUN npm run build

# 2. Phase de RUN
FROM --platform=linux/amd64 node:20-alpine
WORKDIR /backend

# Récupération des fichiers nécessaires
COPY --from=builder /backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /backend/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist
# On copie aussi prisma.config.ts et le schema pour la prod au cas où
COPY --from=builder /backend/prisma ./prisma
COPY --from=builder /backend/prisma.config.ts ./

# On installe les dépendances de prod
RUN npm install --omit=dev

EXPOSE 8080

# On utilise la variable PORT de GCP
CMD ["node", "dist/main.js"]