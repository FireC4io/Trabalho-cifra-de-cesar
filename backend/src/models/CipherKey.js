const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const CipherKey = sequelize.define('CipherKey', {
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = CipherKey;
