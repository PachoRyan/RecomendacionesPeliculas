const { Router } = require('express');
const { getAll, add, remove } = require('../controllers/watchlist.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);
router.get('/', getAll);
router.post('/', add);
router.delete('/:movieId', remove);

module.exports = router;
