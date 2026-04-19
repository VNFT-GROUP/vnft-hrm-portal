# =========================================
# Stage 1: Build the React (Vite) Application
# =========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy các tệp cấu hình package để cài dependency
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ code và tiến hành build
COPY . .
RUN npm run build

# =========================================
# Stage 2: Serve tĩnh với Nginx
# =========================================
FROM nginx:stable-alpine AS runner

# Xoá file HTML mặc định của nginx đi
RUN rm -rf /usr/share/nginx/html/*

# Copy cấu hình Nginx custom (để fix lỗi React Router & Cache)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Lưu ý: Vite build ra thư mục /app/dist 
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]