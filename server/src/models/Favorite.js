const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Favorite = sequelize.define('Favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    posterPath: { type: DataTypes.STRING },
    voteAverage: { type: DataTypes.FLOAT },
    releaseDate: { type: DataTypes.STRING },
});

Favorite.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });

module.exports = Favorite;
