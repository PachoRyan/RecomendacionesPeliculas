const { Router } = require('express');
const authRoutes = require('./auth.routes');
const moviesRoutes = require('./movies.routes');
const searchRoutes = require('./search.routes');
const favoritesRoutes = require('./favorites.routes');
const watchlistRoutes = require('./watchlist.routes');
const historyRoutes = require('./history.routes');
const recommendationsRoutes = require('./recommendations.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/movies', moviesRoutes);
router.use('/search', searchRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/history', historyRoutes);
router.use('/recommendations', recommendationsRoutes);

module.exports = router;
