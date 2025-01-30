const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // Disable SQL query logs
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log('✅ Connected to MySQL using Sequelize'))
    .catch(err => console.error('❌ Error connecting to MySQL:', err));

module.exports = sequelize;
