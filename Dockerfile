# Use uma imagem oficial do Node.js como base
FROM node:14

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
