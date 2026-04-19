const { Router } = require('express');
const { getAll, clear } = require('../controllers/history.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);
router.get('/', getAll);
router.delete('/', clear);

module.exports = router;
