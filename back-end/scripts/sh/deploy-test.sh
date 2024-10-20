#!/bin/bash

# Diretório da aplicação
APP_DIR=/home/opc/servers/AlugueQuadras

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

# Puxar as últimas mudanças do repositório
git pull origin test

# Construir os containers Docker
docker compose -f ../../docker/docker-compose.commom.yml -f ../../docker-compose.test.yml up -d --build

# Verificar o status dos containers
docker compose -f ../../docker/docker-compose.commom.yml -f ../../docker-compose.test.yml ps
