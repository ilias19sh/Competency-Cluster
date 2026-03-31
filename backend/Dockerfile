FROM node:20-alpine

WORKDIR /backend

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=library

COPY package*.json ./
RUN npm ci --omit=dev

COPY dist ./dist
COPY prisma ./prisma
COPY node_modules/.prisma ./node_modules/.prisma
COPY node_modules/@prisma ./node_modules/@prisma

EXPOSE 8080

CMD ["node", "dist/main.js"]