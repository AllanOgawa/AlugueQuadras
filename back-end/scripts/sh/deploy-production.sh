#!/bin/bash

# Diretório da aplicação
APP_DIR=/home/opc/servers/AlugueQuadras/back-end

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

git pull origin master

# Construir os containers Docker
docker compose -f ./docker/production/docker-compose.production.yml up -d --build

# Verificar o status dos containers 
docker compose -f ./docker/production/docker-compose.production.yml ps
