# -- Stage 1: install deps ---------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# -- Stage 2: build ----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_API_URL must be set at build time so Next.js bakes it in.
# Pass it via --build-arg when running docker build, or set it in render.yaml.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# -- Stage 3: lean runtime ---------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only the output needed to run the server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Render injects PORT; Next.js standalone server reads it automatically
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
