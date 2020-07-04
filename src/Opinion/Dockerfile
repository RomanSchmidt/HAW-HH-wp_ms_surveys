FROM node:12.18.2-slim

RUN npm install pm2 -g --save
RUN npm install ts-node -g --save
RUN npm install source-map-support -g --save
RUN npm install typescript -g --save
RUN mkdir -p /app

WORKDIR /app

COPY tsconfig.json .
COPY package.json .
COPY npm-shrinkwrap.json .

RUN npm install

#COPY src/ src/
COPY dist/Core dist/Core
COPY dist/Opinion dist/Opinion

#RUN ls -la /app

#RUN tsc

#COPY dist/ ./dist

EXPOSE "$PORT"

ENV NODE_ENV "$ENVIRONMENT"

CMD pm2 start dist/Opinion/index.js --name "opinion" --no-daemon --source-map-support -- --MONGO_URI "$MONGO_URI" --FOREIGN_SERVICE_SURVEY "$FOREIGN_SERVICE_SURVEY" --PORT "$PORT" --ENVIRONMENT "$ENVIRONMENT"