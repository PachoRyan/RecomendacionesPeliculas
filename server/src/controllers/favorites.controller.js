const { Favorite } = require('../models');

const getAll = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({ where: { userId: req.user.id } });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const add = async (req, res) => {
    const { movieId, title, posterPath, voteAverage, releaseDate } = req.body;
    try {
        const existing = await Favorite.findOne({ where: { userId: req.user.id, movieId } });
        if (existing) return res.status(409).json({ error: 'Already in favorites' });

        const favorite = await Favorite.create({
            userId: req.user.id,
            movieId,
            title,
            posterPath,
            voteAverage,
            releaseDate,
        });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await Favorite.destroy({
            where: { userId: req.user.id, movieId: req.params.movieId },
        });
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, add, remove };
