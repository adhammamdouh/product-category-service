FROM node:alpine

RUN apk update && apk add nano wget curl

WORKDIR /var/www
COPY package*.json ./
RUN npm install

COPY . ./
EXPOSE 3000

ENTRYPOINT ["npm", "start"]