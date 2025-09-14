'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Debug log for database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log(`Model loaded: ${model.name}`); // Debug log for model loading
  });

const Candidate = require('./Candidate')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Job = require('./Job')(sequelize, Sequelize.DataTypes);
const Match = require('./Match')(sequelize, Sequelize.DataTypes);
const Tenant = require('./Tenant')(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  Candidate,
  User,
  Job,
  Match,
  Tenant,
};

module.exports = db;
