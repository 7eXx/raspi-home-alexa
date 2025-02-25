FROM node:20-bookworm-slim AS build

WORKDIR /workdir

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run lint
RUN npm run build

# -- STAGE 2: Deploy --
FROM node:20-bookworm-slim

WORKDIR /opt/raspi-alexa
COPY --from=build /workdir/package*.json ./
COPY --from=build /workdir/dist ./dist
COPY --from=build /workdir/.env ./

RUN npm install --only=production

EXPOSE 3000

CMD [ "node", "dist/index.js" ]


