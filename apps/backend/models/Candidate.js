const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Candidate = sequelize.define('Candidate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: true, // Made tenantId optional
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    cvPath: {
      type: DataTypes.STRING,
      allowNull: true, // CV is optional
    },
  });

  return Candidate;
};