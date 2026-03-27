# Usar Node 22 (compatível com Vite)
FROM node:22-alpine

WORKDIR /app

# Copia apenas package.json e package-lock.json para instalar dependências
COPY package*.json ./
RUN npm install

EXPOSE 5173

# Rodar em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
