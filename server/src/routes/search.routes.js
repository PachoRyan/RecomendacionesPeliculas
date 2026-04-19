const { Router } = require('express');
const { smartSearch } = require('../controllers/search.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

const optionalAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return next();
    authMiddleware(req, res, next);
};

router.get('/', optionalAuth, smartSearch);

module.exports = router;
