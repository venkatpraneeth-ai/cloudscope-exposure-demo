# Stage 1: Build React Frontend
FROM node:18 AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build Node Backend
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build-stage /app/client/build ./client/build
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]