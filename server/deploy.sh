#!/bin/bash

# 1. Clonar el repositorio
echo "--- 1/5 Clonando repositorio ---"
# Borramos la carpeta si ya existe para evitar errores de duplicado
rm -rf RecomendacionesPeliculas
git clone https://github.com/PachoRyan/RecomendacionesPeliculas.git
cd RecomendacionesPeliculas/server

# 2. Crear el archivo .env dentro de la carpeta server
echo "--- 2/5 Creando archivo .env ---"
cat <<EOF > .env
PORT=3001
DB_HOST=host.docker.internal
DB_PORT=3306
DB_NAME=movie_finder
DB_USER=root
DB_PASSWORD=Fubuki00

TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWQ3YmNkMGY4OTlmNDI1MTQxMzlkNjQ0ODlhNzcyOSIsIm5iZiI6MTc3NTcwNTc4NS4yNTksInN1YiI6IjY5ZDcxZWI5NTQ5MWI4Yjc4Mjc1OTMzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F4cm1eQafCZxLmZ-oQEHsXizWqNVNmYTTE-hlxcxrN8
GEMINI_API_KEY=AIzaSyBcCs-JkaH8CeDNhNvffL73djBqX0i-HSE
JWT_SECRET=cineai_super_secret_key_2024
EOF

# 3. Construir la imagen de Docker
echo "--- 3/5 Construyendo imagen de Docker ---"
docker build -t mi-servidor-node .

# 4. Ejecutar Pruebas Unitarias con Jest
echo "--- 4/5 Ejecutando pruebas unitarias con Jest ---"
# Usamos el contenedor para correr npm test antes de desplegar
docker run --rm mi-servidor-node npm test

# Revisamos si los tests pasaron (exit code 0)
if [ $? -eq 0 ]; then
    echo "--- 5/5 Pruebas superadas. Desplegando contenedor ---"
    
    # Detener y eliminar contenedor previo con el mismo nombre si existe
    docker rm -f servidor-node-container 2>/dev/null
    
    # Ejecutar el contenedor final en el puerto 3001
    docker run -d \
      --name servidor-node-container \
      -p 3001:3001 \
      --env-file .env \
      mi-servidor-node
      
    echo "--------------------------------------------------------"
    echo "✅ EXITOSO: Servidor corriendo en http://localhost:3001"
    echo "--------------------------------------------------------"
else
    echo "--------------------------------------------------------"
    echo "❌ ERROR: Las pruebas fallaron. El despliegue se abortó."
    echo "--------------------------------------------------------"
    exit 1
fi