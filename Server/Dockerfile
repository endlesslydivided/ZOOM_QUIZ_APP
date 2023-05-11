FROM node:20-alpine

WORKDIR /Server

COPY package*.json .

RUN npm ci

COPY . .

COPY ./dist ./dist

ENTRYPOINT npm run start
