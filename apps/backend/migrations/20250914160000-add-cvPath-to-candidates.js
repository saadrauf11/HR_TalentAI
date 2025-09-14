"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Candidates', 'cvPath', {
      type: Sequelize.STRING,
      allowNull: true, // CV is optional
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Candidates', 'cvPath');
  },
};