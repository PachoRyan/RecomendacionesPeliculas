const { SearchHistory } = require('../models');

const getAll = async (req, res) => {
    try {
        const history = await SearchHistory.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20,
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clear = async (req, res) => {
    try {
        await SearchHistory.destroy({ where: { userId: req.user.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, clear };
