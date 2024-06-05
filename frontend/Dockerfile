FROM node:lts-alpine as build-stage
 WORKDIR /app
 COPY package*.json ./
 RUN npm ci
 COPY . .
 EXPOSE 3000
 CMD ["npm", "start"]