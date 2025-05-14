# Step 1: Build the app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the project
RUN npm run build

# Step 2: Serve using 'serve'
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy build output from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]
