FROM node:18.16-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install -g @nestjs/cli

RUN npm install

RUN npm ci --omit=dev

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
