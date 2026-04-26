# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy workspace root files for npm workspaces
COPY package.json package-lock.json ./

# Copy only the target app's package.json
COPY apps/crm/package.json ./apps/crm/

# Install all deps (npm workspaces needs the root lockfile)
RUN npm ci --workspace=apps/crm

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time env vars (inject via Dokploy Build Arguments)
ARG VITE_BACKEND_BASE_URL
ARG VITE_GATEWAY_URL
ARG VITE_HRM_URL
ARG VITE_CRM_URL

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/crm/node_modules ./apps/crm/node_modules

# Copy source code
COPY apps/crm/ ./apps/crm/
COPY package.json turbo.json ./

# Build the app
WORKDIR /app/apps/crm
RUN npx vite build

# ============================================
# Stage 3: Serve with Nginx
# ============================================
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/crm/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
