const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('postgres', 'postgres', 'example', {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false
});

async function testDbConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, testDbConnection }
