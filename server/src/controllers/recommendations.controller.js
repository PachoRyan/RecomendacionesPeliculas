const { getPersonalizedRecommendations, TMDB_GENRES } = require('../services/gemini');
const { discoverMovies } = require('../services/tmdb');
const { Favorite } = require('../models');

const getRecommendations = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({ where: { userId: req.user.id } });
        if (favorites.length === 0) return res.status(400).json({ error: 'No favorites yet' });

        const suggestions = await getPersonalizedRecommendations(favorites);

        const results = await Promise.all(
            suggestions.map(async (s) => {
                const genreIds = s.genres.map((g) => TMDB_GENRES[g]).filter(Boolean);
                const { results: movies } = await discoverMovies(genreIds);
                return { reason: s.reason, genres: s.genres, movies: movies.slice(0, 6) };
            })
        );

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getRecommendations };
