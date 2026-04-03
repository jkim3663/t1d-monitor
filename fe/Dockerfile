FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

ARG NPM_BUILD_CMD
RUN npm run ${NPM_BUILD_CMD}

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173"]