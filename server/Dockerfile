# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar el cache)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto que usa tu server (ejemplo: 3001)
EXPOSE 3001

# Comando para arrancar la app
CMD ["node", "index.js"]