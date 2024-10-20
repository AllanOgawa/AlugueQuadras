#!/bin/bash

# Diretório da aplicação
APP_DIR=/home/opc/servers/AlugueQuadras

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

# Puxar as últimas mudanças do repositório
git pull origin main

# Definir o NODE_ENV
export NODE_ENV=production

# Construir e iniciar os containers
docker-compose -f docker/docker-compose.common.yml -f docker/docker-compose.production.yml up -d --build --remove-orphans
