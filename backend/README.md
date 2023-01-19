# Description

This is the backend for a portfolio management app developed during the winter semester 2022/23 in the lecture "Mobile Systems" by Dr. Simon Lichte at the Hochschule Düsseldorf.

## Used Technologies

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger

## Installation

To enable local syntax and type checking run

```bash
$ npm install
```

## Local Developement

Run

```bash
$ docker compose up
```

to start containers for:
- the backend API at  http://localhost:8080/api
- prisma studio at http://localhost:5555/
- pg admin at http://localhost:5557/


## Installing dependencies

To install or update a dependency run

```bash
$ npm install <package>
```

for local syntax checking aswell as 

```bash
$ docker compose up --build
```

to rebuild the backend container with the new or updated dependency.

 
## Seeding the Database

- after starting the containers connect to the backend container and run 

```bash
$ npx prisma seed
```

to seed the database with:

- 3 users
- 20 stocks
- 150k entries of historc stock data
- 25 transactions

The data can be alternated and/or explored with prisma studio or pg admin.

## Before Deployment

Go one folder up to the folder that contains the web frontend aswell as the backend and run

```bash
$ docker compose -f docker-compose.dev.yml 
```

to check if local deployment via caddy works.

The API should be available at https://api.localhost/ and the frontend at https://app.localhost/
