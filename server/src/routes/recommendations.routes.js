const { Router } = require('express');
const { getRecommendations } = require('../controllers/recommendations.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, getRecommendations);

module.exports = router;
