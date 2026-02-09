# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar un servidor HTTP simple y curl para healthcheck
RUN npm install -g serve && apk add --no-cache curl

# Copiar los archivos construidos desde el stage anterior
COPY --from=build /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
