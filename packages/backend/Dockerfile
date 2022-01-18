FROM node:15.9-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD [ "node", "./bin/www" ]
