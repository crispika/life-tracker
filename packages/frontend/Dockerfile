# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/db/package.json ./packages/db/

RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Reinstall pnpm because new docker stage builder 
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules

# build prisma client
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY packages/db/package.json ./packages/db/
COPY packages/db/index.ts ./packages/db/
COPY packages/db/prisma ./packages/db/prisma
RUN cd packages/db && npx prisma generate

# build frontend
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/frontend/src ./packages/frontend/src
COPY packages/frontend/public ./packages/frontend/public
COPY packages/frontend/next.config.js ./packages/frontend/
COPY packages/frontend/tsconfig.json ./packages/frontend/
COPY packages/frontend/postcss.config.js ./packages/frontend/
COPY packages/frontend/tailwind.config.js ./packages/frontend/
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN cd packages/frontend && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/frontend/public ./packages/frontend/public
COPY --from=builder /app/packages/frontend/.next/standalone/. ./
COPY --from=builder /app/packages/frontend/.next/static ./packages/frontend/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "packages/frontend/server.js"]