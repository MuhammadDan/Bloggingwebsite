'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Pehle check karo table exist karta hai ya nahi
    const tableExists = await queryInterface.tableExists('users'); // small 'users'

    if (!tableExists) {
      console.log(" Users table does not exist. Please check your database.");
      return;
    }

    await queryInterface.addColumn('users', 'aiCredits', {   // ← 'users' small letters
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });

    await queryInterface.addColumn('users', 'aiGeneratedPosts', {  // ← 'users' small letters
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Existing users ko credits dena
    await queryInterface.sequelize.query(`
      UPDATE "users" 
      SET "aiCredits" = 10 
      WHERE "aiCredits" IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'aiCredits');
    await queryInterface.removeColumn('users', 'aiGeneratedPosts');
  }
};