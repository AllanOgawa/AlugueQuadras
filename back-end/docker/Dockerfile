# -----------------------------------------------------
# Stage 1: Build the application
# -----------------------------------------------------
  FROM node:18-alpine AS builder

  # Define o diretório de trabalho dentro do container
  WORKDIR /app
  
  # Copia os arquivos de dependências
  COPY package*.json ./
  
  # Instala todas as dependências, incluindo as de desenvolvimento
  RUN npm ci
  
  # Copia o restante do código da aplicação
  COPY . .
  
  # Compila a aplicação NestJS
  RUN npm run build
  
  # -----------------------------------------------------
  # Stage 2: Production Image
  # -----------------------------------------------------
  FROM node:18-alpine
  
  # Cria um grupo e usuário não-root para executar a aplicação
  RUN addgroup app && adduser -S -G app app
  
  # Define o diretório de trabalho
  WORKDIR /app
  
  # Copia os arquivos de dependências
  COPY package*.json ./
  
  # Instala apenas as dependências de produção
  RUN npm ci --only=production
  
  # Copia os artefatos compilados da etapa de build
  COPY --from=builder /app/dist ./dist
  
  # Altera a propriedade dos arquivos para o usuário não-root
  RUN chown -R app:app /app
  
  # Muda para o usuário não-root
  USER app
  
  # Exponha a porta que a aplicação irá utilizar
  EXPOSE 3000
  
  # Define variáveis de ambiente
  ENV NODE_ENV=production
  
  # (Opcional) Define um healthcheck para monitorar a saúde da aplicação
  # HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  #   CMD curl -f http://localhost:3000/health || exit 1
  
  # Comando para iniciar a aplicação
  CMD ["node", "dist/main"]
  