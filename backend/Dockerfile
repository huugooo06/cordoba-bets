# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expón el puerto que usará Express.js
EXPOSE 3000

# Comando para iniciar la aplicación (ej. con Nodemon para desarrollo)
CMD [ "npm", "run", "dev" ] 
# Nota: Asumo que tienes un script 'dev' en package.json (ej. nodemon server.js)