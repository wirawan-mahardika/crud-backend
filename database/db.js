import { Sequelize } from "sequelize";

export const userDB = new Sequelize('crud', 'root', 'wm050604', {
    host: 'localhost',
    dialect: 'mysql'
})

export const animesDB = new Sequelize('crud', 'root', 'wm050604', {
    host: 'localhost',
    dialect: 'mysql'
})