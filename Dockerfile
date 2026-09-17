FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Keep backend code outside the folder served to browsers.
RUN mkdir -p backend \
    && mv dist/server.cjs backend/server.cjs \
    && rm -f dist/server.cjs.map

FROM node:22-bookworm-slim

# Remediate container vulnerabilities (CVE-2026-39821 on go / base packages)
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/backend ./backend

USER node
EXPOSE 8080
CMD ["node", "backend/server.cjs"]
