# -----------------------------------------------------
# Stage 1: Build the application
# -----------------------------------------------------
  FROM node:18-alpine AS builder

  # Definir o diretório de trabalho dentro do container
  WORKDIR /app
  
  # Copiar os arquivos de dependências
  COPY package*.json ./
  
  # Instalar todas as dependências, incluindo devDependencies
  RUN npm ci
  
  # Copiar o restante do código da aplicação
  COPY . .
  
  # Definir argumento de build para NODE_ENV (padrão: production)
  ARG NODE_ENV=production
  
  # Exportar NODE_ENV como variável de ambiente
  ENV NODE_ENV=${NODE_ENV}
  
  # Executar o script de build correspondente
  RUN npm run build:${NODE_ENV}
  
  # -----------------------------------------------------
  # Stage 2: Runtime Image
  # -----------------------------------------------------
  FROM node:18-alpine
  
  # Criar um grupo e usuário não-root para executar a aplicação
  RUN addgroup app && adduser -S -G app app
  
  # Definir o diretório de trabalho
  WORKDIR /app
  
  # Copiar os arquivos de dependências novamente
  COPY package*.json ./
  
  # Instalar apenas as dependências de produção
  RUN npm ci --only=production
  
  # Copiar os artefatos compilados da etapa de build
  COPY --from=builder /app/dist ./dist
  
  # Altera a propriedade dos arquivos para o usuário não-root
  RUN chown -R app:app /app
  
  # Mudar para o usuário não-root
  USER app
  
  # Expor a porta que a aplicação irá utilizar
  EXPOSE 3000
  
  # Definir variáveis de ambiente específicas (serão sobrescritas pelo Docker Compose)
  ENV NODE_ENV=${NODE_ENV}
  
  # (Opcional) Define um healthcheck para monitorar a saúde da aplicação
  HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
  
  # Comando para iniciar a aplicação
  CMD ["node", "dist/main"]
  