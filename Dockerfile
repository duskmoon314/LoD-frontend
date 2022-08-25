FROM node:current-alpine AS builder

WORKDIR /home/node/app

RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .

RUN pnpm install --offline
RUN pnpm build

FROM node:current-alpine AS app
WORKDIR /home/node/app
ENV NODE_ENV=production

RUN npm i -g serve

COPY --from=builder /home/node/app/dist ./dist

EXPOSE 31415

CMD serve dist -p 31415