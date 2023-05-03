import express from "express";
import { jwtAuth } from "../app.js";
import { createNewAnimeData, deleteAnimeById, getAllAnimes, getAnimeByTitle, updateAnimeData } from "../controllers/animes.controller.js";

const router = express.Router();

//// tanpa authentication
router.get('/search/:title', getAnimeByTitle)
router.route("/")
  .get(getAllAnimes)
//// tanpa authentication

  .post(jwtAuth, createNewAnimeData)
  .put(jwtAuth, updateAnimeData)

router.delete('/:animeId', jwtAuth, deleteAnimeById)

export default router;
