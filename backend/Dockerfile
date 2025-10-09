# Etapa de build
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./
COPY ./src ./src

RUN npm install
RUN npm run build

# Etapa de produção
FROM node:22

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
