ARG APP_PATH=/opt/outline
FROM node:22 AS build-base

ARG APP_PATH
WORKDIR $APP_PATH
COPY ./patches ./patches
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y cmake git

FROM build-base AS deps
ENV NODE_OPTIONS="--max-old-space-size=24000"
ENV CI=true
ENV HUSKY=0

RUN --mount=type=cache,mode=0755,target=/yarn-cache \
    --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    yarn install --production=true --frozen-lockfile

FROM deps AS builder
RUN --mount=type=cache,mode=0755,target=/yarn-cache \
    --mount=type=bind,source=./package.json,target=./package.json \
    --mount=type=bind,source=./yarn.lock,target=./yarn.lock \
    yarn install --no-optional --frozen-lockfile

COPY . .
ARG CDN_URL
RUN yarn build

FROM node:22-slim AS runner
LABEL org.opencontainers.image.source="https://github.com/viettdann/outlinewiki"

ARG APP_PATH=/opt/outline
WORKDIR $APP_PATH
ENV NODE_ENV=production

# Copy application files
COPY ./server/collaboration/Procfile ./server/collaboration/Procfile
COPY ./server/config ./server/config
COPY ./server/migrations ./server/migrations
COPY ./server/static ./server/static
COPY ./public ./public
COPY ./.sequelizerc ./.sequelizerc
COPY ./package.json ./package.json
COPY --from=deps $APP_PATH/node_modules ./node_modules
COPY --from=builder $APP_PATH/build ./build

# Install runtime dependencies and clean up in single layer
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Setup directories and permissions
ENV FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data
RUN mkdir -p "$FILE_STORAGE_LOCAL_ROOT_DIR" /var/lib/outline \
    && chown -R node:node $APP_PATH/build /var/lib/outline \
    && chmod 755 "$FILE_STORAGE_LOCAL_ROOT_DIR"

VOLUME /var/lib/outline/data

USER node

HEALTHCHECK --interval=1m --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- "http://localhost:${PORT:-3000}/_health" | grep -q "OK" || exit 1

EXPOSE 3000
CMD ["yarn", "start"]