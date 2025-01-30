const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import your sequelize instance

const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sex: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,  
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,  
        onUpdate: Sequelize.NOW, 
    }
}, {
    // Additional options
    tableName: 'students',  
    timestamps: false,      
});

module.exports = Student;
