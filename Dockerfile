# Stage 1: Build the React app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the build using a minimal image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port the app runs on
EXPOSE 5173

# Serve the app
CMD ["serve", "-s", "dist", "-l", "5173"]
