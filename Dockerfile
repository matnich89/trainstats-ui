# Stage 1: Build the React application
FROM node:22-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the built application
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Install a simple server for serving static content
RUN npm install -g serve

# Copy built assets from the build stage
COPY --from=build /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]