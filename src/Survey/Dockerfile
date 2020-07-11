FROM node:12.18.2-slim

RUN npm install pm2 -g --save
RUN npm install ts-node -g --save
RUN npm install source-map-support -g --save
RUN npm install typescript -g --save
#RUN npm install mocha -g --save
RUN mkdir -p /app

WORKDIR /app

COPY tsconfig.json .
COPY package.json .
COPY npm-shrinkwrap.json .

RUN npm install --save-dev

COPY src/Core src/Core
COPY src/Survey src/Survey

RUN npm run build

RUN npm run testDot MONGO_URI="$MONGO_URI" FOREIGN_SERVICE_OPINION="$FOREIGN_SERVICE_OPINION" PORT="$PORT" ENVIRONMENT="test"

RUN npm install --save-prod

EXPOSE "$PORT"

ENV NODE_ENV "$ENVIRONMENT"

CMD pm2 start dist/Survey/index.js --name "survey" --no-daemon --source-map-support -- --MONGO_URI "$MONGO_URI" --FOREIGN_SERVICE_OPINION "$FOREIGN_SERVICE_OPINION" --PORT "$PORT" --ENVIRONMENT "$ENVIRONMENT"