const sequelize = require('../config/database');
const User = require('./User');
const Favorite = require('./Favorite');
const Watchlist = require('./Watchlist');
const SearchHistory = require('./SearchHistory');

module.exports = { sequelize, User, Favorite, Watchlist, SearchHistory };
