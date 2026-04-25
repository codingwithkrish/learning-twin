# --- Backend Build Stage ---
FROM node:20-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# --- Frontend Build Stage ---
FROM node:20-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend ./backend
WORKDIR /app/backend
RUN npm install --production

# Copy frontend static build
COPY --from=frontend-builder /app/dist ./public

# Expose port
EXPOSE 5001

CMD ["node", "src/server.js"]
