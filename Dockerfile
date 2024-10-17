# Build stage
FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy the build output and static assets
COPY --from=build /app/build ./build
COPY --from=build /app/static ./static
COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm ci --production

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "build"]
