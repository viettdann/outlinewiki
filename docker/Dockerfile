ARG APP_PATH=/opt/outline
FROM node:22 AS build-base

ARG APP_PATH
WORKDIR $APP_PATH
COPY ./package.json ./yarn.lock ./
COPY ./patches ./patches

RUN apt-get update && apt-get install -y cmake

FROM build-base AS deps
ENV NODE_OPTIONS="--max-old-space-size=24000"

RUN yarn install --production=true --frozen-lockfile

FROM deps AS builder
RUN yarn install --no-optional --frozen-lockfile

COPY . .
ARG CDN_URL
RUN yarn build

FROM node:22-slim AS runner
LABEL org.opencontainers.image.source="https://github.com/viettdann/outlinewiki"

ARG APP_PATH=/opt/outline
WORKDIR $APP_PATH
ENV NODE_ENV=production

# Chỉ copy những gì cần thiết:
COPY ./server/collaboration/Procfile ./server/collaboration/Procfile
COPY ./server/config ./server/config
COPY ./server/migrations ./server/migrations
COPY ./server/static ./server/static
COPY ./public ./public
COPY ./.sequelizerc ./.sequelizerc
COPY ./package.json ./package.json
COPY --from=deps $APP_PATH/node_modules ./node_modules
COPY --from=builder $APP_PATH/build ./build

# Install wget to healthcheck the server
RUN  apt-get update \
    && apt-get install -y wget \
    && rm -rf /var/lib/apt/lists/*
# Create a non-root user compatible with Debian and BusyBox based images
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --ingroup nodejs nodejs && \
    chown -R nodejs:nodejs $APP_PATH/build && \
    mkdir -p /var/lib/outline && \
    chown -R nodejs:nodejs /var/lib/outline

ENV FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data
RUN mkdir -p "$FILE_STORAGE_LOCAL_ROOT_DIR" && \
    chown -R nodejs:nodejs "$FILE_STORAGE_LOCAL_ROOT_DIR" && \
    chmod 1777 "$FILE_STORAGE_LOCAL_ROOT_DIR"

VOLUME /var/lib/outline/data

USER nodejs

HEALTHCHECK --interval=1m CMD wget -qO- "http://localhost:${PORT:-3000}/_health" | grep -q "OK" || exit 1

EXPOSE 3000
CMD ["yarn", "start"]
