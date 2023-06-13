# dev.Dockerfile for development

FROM node:19-alpine

WORKDIR /thewings-frontend

# Install dependencies based on the preferred package manager
COPY thewings-frontend/package.json thewings-frontend/yarn.lock* thewings-frontend/package-lock.json* thewings-frontend/pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

COPY ./thewings-frontend/ .

CMD yarn dev