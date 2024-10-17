#!/bin/bash

# Diretório da aplicação
APP_DIR=/caminho/para/seu-app

# Navegar até o diretório da aplicação
cd $APP_DIR || { echo "Diretório não encontrado: $APP_DIR"; exit 1; }

# Puxar as últimas mudanças do repositório
git pull origin main

# Construir os containers Docker
docker compose -f docker-compose.yml -f docker-compose.producao.yml up -d --build

# Verificar o status dos containers
docker compose -f docker-compose.yml -f docker-compose.producao.yml ps
