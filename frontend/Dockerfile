# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia archivos de dependencias
COPY package*.json ./

# Instala las dependencias (el --force es para evitar conflictos de caché)
# Instalamos también las dependencias de desarrollo (devDependencies)
RUN npm install --silent --force

# Copia el resto del código fuente
COPY . .

# Expón el puerto de desarrollo de Vue
EXPOSE 5173

# Comando para iniciar la aplicación de Vue usando el script definido en package.json
CMD ["npm", "run", "dev"]