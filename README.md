# 🎬 CineAI

Buscador inteligente de películas powered by Gemini AI y TMDB.
Describe lo que quieres ver en lenguaje natural y la IA encuentra las mejores opciones para ti.

![Stack](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Node-Express-339933?style=flat-square&logo=node.js)
![Stack](https://img.shields.io/badge/MySQL-Sequelize-4479a1?style=flat-square&logo=mysql)
![Stack](https://img.shields.io/badge/Gemini-AI-4285f4?style=flat-square&logo=google)

---

## Características

- Búsqueda en lenguaje natural interpretada por Gemini AI
- Resultados paginados desde The Movie Database (TMDB)
- Autenticación con JWT
- Favoritos y lista "Quiero ver" persistentes
- Historial de búsquedas
- Recomendaciones personalizadas basadas en favoritos
- Resumen inteligente de reseñas con IA
- Trailer de YouTube embebido
- Animaciones con Framer Motion

---

## Stack

| Capa          | Tecnología        |
| ------------- | ----------------- |
| Frontend      | React 18 + Vite   |
| Animaciones   | Framer Motion     |
| Backend       | Node.js + Express |
| Base de datos | MySQL + Sequelize |
| IA            | Google Gemini API |
| Películas     | TMDB API          |
| Auth          | JWT + bcryptjs    |

---

## Requisitos previos

- Node.js 18+
- MySQL 8+
- Cuenta en [TMDB](https://www.themoviedb.org) para la API key
- Cuenta en [Google AI Studio](https://aistudio.google.com) para la Gemini API key

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jamie026/RecomendacionesPeliculas.git
cd movie-finder
```

### 2. Configurar el servidor

```bash
cd server
npm install
```

Crear `server/.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movie_finder
DB_USER=root
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_TOKEN=tu_tmdb_token
GEMINI_API_KEY=tu_gemini_api_key
```

### 3. Crear la base de datos

```sql
CREATE DATABASE movie_finder;
```

### 4. Configurar el cliente

```bash
cd ../client
npm install
```

---

## Uso

### Desarrollo

Desde `server/`:

```bash
npm run dev
```

Desde `client/`:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## Variables de entorno

| Variable         | Descripción                       |
| ---------------- | --------------------------------- |
| `PORT`           | Puerto del servidor               |
| `DB_HOST`        | Host de MySQL                     |
| `DB_NAME`        | Nombre de la base de datos        |
| `DB_USER`        | Usuario de MySQL                  |
| `DB_PASSWORD`    | Contraseña de MySQL               |
| `JWT_SECRET`     | Clave secreta para tokens JWT     |
| `TMDB_TOKEN`     | Token de acceso de la API de TMDB |
| `GEMINI_API_KEY` | API key de Google Gemini          |

---

## API Endpoints

### Auth

| Método | Ruta                 | Descripción         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Registro de usuario |
| POST   | `/api/auth/login`    | Login               |
| GET    | `/api/auth/me`       | Usuario actual      |

### Búsqueda

| Método | Ruta                    | Descripción                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/search?query=...` | Búsqueda inteligente con IA |

### Películas

| Método | Ruta                           | Descripción               |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/api/movies/search?query=...` | Búsqueda directa en TMDB  |
| GET    | `/api/movies/:id`              | Detalle de película       |
| GET    | `/api/movies/:id/videos`       | Trailer                   |
| GET    | `/api/movies/:id/reviews`      | Resumen de reseñas con IA |

### Usuario

| Método | Ruta                      | Descripción                           |
| ------ | ------------------------- | ------------------------------------- |
| GET    | `/api/favorites`          | Obtener favoritos                     |
| POST   | `/api/favorites`          | Agregar favorito                      |
| DELETE | `/api/favorites/:movieId` | Eliminar favorito                     |
| GET    | `/api/watchlist`          | Obtener watchlist                     |
| POST   | `/api/watchlist`          | Agregar a watchlist                   |
| DELETE | `/api/watchlist/:movieId` | Eliminar de watchlist                 |
| GET    | `/api/history`            | Historial de búsquedas                |
| DELETE | `/api/history`            | Limpiar historial                     |
| GET    | `/api/recommendations`    | Recomendaciones personalizadas con IA |

---
