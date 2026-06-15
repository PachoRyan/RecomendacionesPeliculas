#!/bin/bash

# 1. Clonar el repositorio
echo "--- 1/5 Clonando repositorio ---"
# Borramos la carpeta si ya existe para evitar errores de duplicado
rm -rf RecomendacionesPeliculas
git clone https://github.com/PachoRyan/RecomendacionesPeliculas.git
cd RecomendacionesPeliculas

# 2. Crear el archivo .env dentro de la carpeta server
echo "--- 2/5 Creando archivo .env ---"
cat <<EOF > server/.env
PORT=3001
DB_HOST=mysql
DB_PORT=3306
DB_NAME=movie_finder
DB_USER=root
DB_PASSWORD=coconut

TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWQ3YmNkMGY4OTlmNDI1MTQxMzlkNjQ0ODlhNzcyOSIsIm5iZiI6MTc3NTcwNTc4NS4yNTksInN1YiI6IjY5ZDcxZWI5NTQ5MWI4Yjc4Mjc1OTMzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F4cm1eQafCZxLmZ-oQEHsXizWqNVNmYTTE-hlxcxrN8
GEMINI_API_KEY=AIzaSyBcCs-JkaH8CeDNhNvffL73djBqX0i-HSE
JWT_SECRET=cineai_super_secret_key_2024
EOF

# 3. Construir la imagen de Docker
echo "--- 3/5 Construyendo imagen de Docker ---"
docker build -t mi-servidor-node ./server

# 4. Ejecutar Pruebas Unitarias con Jest
echo "--- 4/5 Ejecutando pruebas unitarias con Jest ---"
docker run --rm mi-servidor-node npm test

# Revisamos si los tests pasaron (exit code 0)
if [ $? -eq 0 ]; then
    echo "--- 5/5 Pruebas superadas. Desplegando con Docker Compose ---"

    # Detener y eliminar servicios previos si existen
    docker compose down --remove-orphans 2>/dev/null

    # Levantar todos los servicios (MySQL + servidor Node)
    docker compose up -d --build

    echo "--------------------------------------------------------"
    echo "✅ EXITOSO:"
    echo "   Frontend  → http://localhost:3000"
    echo "   Backend   → http://localhost:3001"
    echo "--------------------------------------------------------"
else
    echo "--------------------------------------------------------"
    echo "❌ ERROR: Las pruebas fallaron. El despliegue se abortó."
    echo "--------------------------------------------------------"
    exit 1
fi