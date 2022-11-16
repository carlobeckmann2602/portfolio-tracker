FROM node:current-alpine3.16
WORKDIR /usr/app
COPY package.json .

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .
RUN npm install --quiet
RUN npx prisma generate