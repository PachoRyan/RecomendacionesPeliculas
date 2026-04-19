const axios = require('axios');

const tmdb = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    headers: {
        Authorization: 'Bearer ' + process.env.TMDB_TOKEN,
        'Content-Type': 'application/json',
    },
});

const searchMovies = async (query, page = 1) => {
    const { data } = await tmdb.get('/search/movie', {
        params: { query, page, language: 'es-ES' },
    });
    return { results: data.results, totalPages: data.total_pages };
};

const discoverMovies = async (genreIds, page = 1) => {
    const params = {
        sort_by: 'popularity.desc',
        language: 'es-ES',
        page,
    };
    if (genreIds && genreIds.length) params.with_genres = genreIds.join(',');
    const { data } = await tmdb.get('/discover/movie', { params });
    return { results: data.results, totalPages: data.total_pages };
};

const getMovieDetails = async (movieId) => {
    const { data } = await tmdb.get('/movie/' + movieId, {
        params: { language: 'es-ES' },
    });
    return data;
};

const getMovieVideos = async (movieId) => {
    const { data } = await tmdb.get('/movie/' + movieId + '/videos', {
        params: { language: 'es-ES' },
    });
    return data.results;
};

const getMovieReviews = async (movieId) => {
    const { data } = await tmdb.get('/movie/' + movieId + '/reviews', {
        params: { language: 'en-US', page: 1 },
    });
    return data.results.slice(0, 5);
};

module.exports = { searchMovies, discoverMovies, getMovieDetails, getMovieVideos, getMovieReviews };
