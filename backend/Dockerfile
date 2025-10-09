# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./
COPY ./src ./src

RUN npm install
RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev
RUN npm run migrate

EXPOSE 3000

CMD ["npm", "run", "start"]
