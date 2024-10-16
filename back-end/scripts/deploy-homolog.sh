#!/bin/bash

# Diretório da aplicação
APP_DIR=/caminho/para/seu-app

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

# Puxar as últimas mudanças do repositório
git pull origin develop

# Construir os containers Docker
docker compose -f docker-compose.yml -f docker-compose.homolog.yml up -d --build

# Verificar o status dos containers
docker compose -f docker-compose.yml -f docker-compose.homolog.yml ps
