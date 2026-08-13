# -- Stage 1: build / dependency install -------------------------------------
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies into a prefix so we can copy them to the final image
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# -- Stage 2: lean runtime image ---------------------------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY . .

# Seed the SQLite database at build time so it ships pre-populated
RUN python -c "from app.seed import seed_database; seed_database()" 2>/dev/null || true

# Render injects PORT at runtime; fall back to 8000 locally
ENV PORT=8000

EXPOSE 8000

# Use sh -c so the shell can expand $PORT
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
