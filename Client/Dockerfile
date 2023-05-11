FROM node:20-alpine

WORKDIR /Client

COPY package*.json .

RUN npm ci

COPY . .

COPY ./public ./public

ENTRYPOINT npm run start
