// models/tutor.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assuming you have a Sequelize instance

const Tutor = sequelize.define('Tutor', {
    tutor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Assuming each user can only have one tutor profile
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sex: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    qualifications: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    subjects_offered: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
    }
}, {
    tableName: 'tutors',  // Map the model to the tutors table
    timestamps: false     // We are manually handling the timestamps (created_at, updated_at)
});

module.exports = Tutor;
