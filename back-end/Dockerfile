# Usar a imagem oficial do Node.js como base
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências da aplicação
RUN npm install

# Copiar o restante do código da aplicação para o diretório de trabalho
COPY . .

# Expor a porta 3000 para acessar a aplicação
EXPOSE 3000

# Comando para instalar as dependências e iniciar a aplicação
CMD ["npm", "install", "&&", "npm", "run", "run", "&&", "npm", "run", "prod"]