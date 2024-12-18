FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn db:generate

RUN yarn build

CMD [ "yarn", "start:dev" ]

