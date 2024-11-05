#!/bin/bash

# Diretório da aplicação
APP_DIR=/home/opc/servers/AlugueQuadrasHomologation/back-end

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

git pull origin develop

# Construir os containers Docker
sudo docker compose -f ./docker/homologation/docker-compose.homologation.yml up -d --build

# Verificar o status dos containers 
sudo docker compose -f ./docker/homologation/docker-compose.homologation.yml ps
