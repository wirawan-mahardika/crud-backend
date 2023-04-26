import { DataTypes } from "sequelize";
import database from "../db.js";

const ANIMES = database.define(
  "animes",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalEpisode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sinopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    season: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    durasi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tanggalRilis: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ["title", "genre"],
      },
    ],
  }
);

export default ANIMES;
