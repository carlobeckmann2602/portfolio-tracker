#!/bin/bash

set -e
set -x

git pull
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml restart reverse-proxy

