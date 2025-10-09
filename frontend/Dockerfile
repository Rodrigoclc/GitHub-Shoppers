FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve
COPY --from=builder /app/dist ./dist
RUN npm migrate

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
