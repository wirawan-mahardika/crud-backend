import { Sequelize } from "sequelize";

const database = new Sequelize("crud", "root", "wm050604", {
  host: "localhost",
  dialect: "mysql",
});

export default database;
