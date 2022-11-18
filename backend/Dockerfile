FROM node:16
WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8080

CMD npx prisma migrate deploy && npm run start:prod
