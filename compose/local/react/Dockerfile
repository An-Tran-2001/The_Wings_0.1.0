# dev.Dockerfile for development

FROM node:20.5.0-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY thewings-frontend/package*.json ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

COPY ./thewings-frontend/ .

CMD \
    if [ "$NODE_ENV" = "production" ]; then yarn build && yarn start; \
    else yarn dev; \
    fi