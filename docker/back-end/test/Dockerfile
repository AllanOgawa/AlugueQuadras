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

# Buildar a aplicação NestJS para produção
RUN npm run build

# -----------------------------------------------------
# Stage 2: Runtime Image
# -----------------------------------------------------
FROM node:18-alpine

# Criar um grupo e usuário não-root para executar a aplicação
RUN addgroup app && adduser -S -G app app

RUN apk add --no-cache curl

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências novamente
COPY package*.json ./

COPY env/test.env env/test.env

# Instalar apenas as dependências de produção
RUN npm ci --only=production

# Copiar os artefatos compilados da etapa de build
COPY --from=builder /app/dist ./dist

# Altera a propriedade dos arquivos para o usuário não-root
RUN chown -R app:app /app

# Mudar para o usuário não-root
USER app

# Expor a porta que a aplicação irá utilizar
EXPOSE 3002

# (Opcional) Define um healthcheck para monitorar a saúde da aplicação
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://back-end-aluguequadras-test:3002/health || exit 1

CMD ["node", "-r", "dotenv/config", "dist/src/main.js", "dotenv_config_path=env/test.env"]