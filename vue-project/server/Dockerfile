FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm install --only=production

# Copiar el código fuente
COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]

