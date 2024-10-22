#!/bin/bash

# Diretório da aplicação
APP_DIR=/home/opc/servers/AlugueQuadras/back-end

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

git pull origin test

# Construir os containers Docker
sudo docker compose -f ./docker/test/docker-compose.test.yml up -d --build

# Verificar o status dos containers 
sudo docker compose -f ./docker/test/docker-compose.test.yml ps
