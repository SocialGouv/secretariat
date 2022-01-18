FROM node:15.9-alpine

WORKDIR /usr/src

COPY . .

RUN npm ci --only=production

EXPOSE 3000

CMD ["echo", "bonjour"]
#CMD [ "node", "./bin/www" ]
