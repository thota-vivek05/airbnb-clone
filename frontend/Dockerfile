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

# Accept backend URL at build time (pass via --build-arg or Render env var)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# -- Stage 3: lean runtime ---------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# HOSTNAME=0.0.0.0 is required for Next.js standalone to bind on all interfaces
# Without this, Render's reverse proxy cannot reach the container (502 error)
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Copy only the output needed to run the server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]

