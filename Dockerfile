FROM node:lts-alpine AS builder

WORKDIR /home/node/app

RUN npm i -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM svenstaro/miniserve:alpine AS app
WORKDIR /home/app

COPY --from=builder /home/node/app/dist ./dist

EXPOSE 31415

ENTRYPOINT [ "/app/miniserve", "-p", "31415", "--index", "index.html", "dist" ]
