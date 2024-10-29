const { Sequelize } = require('sequelize');
const { error } = require('console');

const sequelize = new Sequelize('QLBanTranh', 'root','',{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

console.log("Another task.")