import express from "express";
import ANIMES from "../database/model/animesModel.js";

const router = express.Router();

router.route("/")
  .get(async (req, res) => {
    const animes = await ANIMES.findAll();
    return res.status(200).json(animes);
  })
  .post(async (req, res) => {
    try {
      await ANIMES.create(req.body);
      return res.status(200).json({status: "success", code: 200, message: "berhasil menyimpan data"});
    } catch (error) {
      console.log(error);
      return res.status(403).json({ status: "failed", code: 403, message: error.message.V });
    }
  })
  .put(async(req,res) => {
    if (!req.body.title) return res.status(403).json({status: "failed", code: 403, message: "proses query membutuhkan title"})
    try {
      await ANIMES.update(req.body, {where: {title: req.body.title}})
      return res.status(200).json({status: "success", code: 200, message: "berhasil mengupdate data"});
    } catch (error) {
      console.log(error)
      return res.status(403).json({status: "failed", code: 403, message: "gagal mengupdate data"});
    }
  })

router.delete('/:animeId', async (req,res) => {
  const animeId = req.params.animeId
  try {
    await ANIMES.destroy({where: {id: animeId}})
    return res.status(200).json({status: "success", code: 200, message: "berhasil melakukan delete anime"})
  } catch (error) {
    console.log(error)    
    return res.status(403).json({status: "failed", code: 403, message: "gagal melakukan delete"})
  }
})

export default router;
