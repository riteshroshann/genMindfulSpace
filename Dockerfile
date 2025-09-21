# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy backend package files first for better caching
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/src ./src

# Build the TypeScript application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3001

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]