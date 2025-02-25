FROM node:20-bookworm AS build

WORKDIR /workdir

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run lint
RUN npm run build

# -- STAGE 2: Deploy --
FROM node:20-bookworm

WORKDIR /app

COPY --from=build /workdir/dist ./dist

ENTRYPOINT [ "node", "dist/index.js" ]


