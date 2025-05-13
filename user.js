const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

// Configure sua conexão MySQL
const sequelize = new Sequelize('db_planilha', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = { User, sequelize };