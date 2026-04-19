const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const SearchHistory = sequelize.define('SearchHistory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    query: { type: DataTypes.STRING, allowNull: false },
    parsedQuery: { type: DataTypes.STRING },
});

SearchHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(SearchHistory, { foreignKey: 'userId' });

module.exports = SearchHistory;
