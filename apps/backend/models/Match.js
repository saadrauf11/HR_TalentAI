const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Match;
};