FROM node:22-slim AS builder
ARG VITE_APP_BACKEND
ARG VITE_APP_KEYCLOAK_URL
# Setup pnpm

WORKDIR /app

# Copy package
COPY package.json package-lock.json ./

# Install depedencies
RUN npm install --frozen-lockfile

# Copy code
COPY . .

# Build static files
RUN npm run build

FROM node:22-slim AS final

# Install serve
RUN npm install -g serve
WORKDIR /app/server
# Ensure safe permissions
RUN addgroup --system --gid 1001 appgroup && \
	adduser --system --uid 1001 --ingroup appgroup --home /app/server appuser

# Copy static files
COPY --from=builder /app/dist ./dist
RUN chown -R appuser:appgroup ./dist
USER appuser
EXPOSE 2002

# Run server
CMD ["serve", "-s", "dist", "-l", "2002"]

