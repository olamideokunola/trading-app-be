# syntax=docker/dockerfile:1

FROM node:15-alpine
WORKDIR /trading-app-be
COPY . /trading-app-be
CMD npm run start-graph
