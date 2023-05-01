import express from "express";
import { jwtAuth } from "../app.js";
import { createNewAnimeData, deleteAnimeById, getAllAnimes, getAnimeByTitle, updateAnimeData } from "../contollers/animes.controller.js";

const router = express.Router();

router.route("/")
  .get(getAllAnimes)
  .post(jwtAuth, createNewAnimeData)
  .put(jwtAuth, updateAnimeData)

router.delete('/:animeId', jwtAuth, deleteAnimeById)
router.get('/search/:title', getAnimeByTitle)

export default router;
