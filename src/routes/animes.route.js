import express from "express";
import ANIMES from "../database/model/animesModel.js";
import { jwtAuth } from "../app.js";
import { Op } from "sequelize";

const router = express.Router();

router.route("/")
  .get(async (req, res) => {
    try {
      const animes = await ANIMES.findAll({limit: 10});
      return res.status(200).json({status: 'success',code: 200, message: 'OK', data: animes});
    } catch (error) {
      console.log(error)
      return res.status(403).json({status: "failed", code: 403, message: "cannot get all data", description: "terjadi kesalahan, coba lagi nanti"})
    }
  })
  .post(jwtAuth, async (req, res) => {
    try {
      await ANIMES.create(req.body);
      return res.status(200).json({status: "success", code: 200, message: "berhasil menyimpan data"});
    } catch (error) {
      console.log(error);
      return res.status(403).json({ status: "failed", code: 403, message: 'gagal menyimpan data', description: "terjadi kesalahan, coba lagi nanti" });
    }
  })
  .put(jwtAuth, async(req,res) => {
    if (!req.body.title) return res.status(403).json({status: "failed", code: 403, message: "proses query membutuhkan title"})
    try {
      await ANIMES.update(req.body, {where: {title: req.body.title}})
      return res.status(200).json({status: "success", code: 200, message: "berhasil mengupdate data"});
    } catch (error) {
      console.log(error)
      return res.status(403).json({status: "failed", code: 403, message: "gagal mengupdate data", description: "terjadi kesalahan, coba lagi nanti"});
    }
  })

router.delete('/:animeId', jwtAuth, async (req,res) => {
  const animeId = req.params.animeId
  try {
    await ANIMES.destroy({where: {id: animeId}})
    return res.status(200).json({status: "success", code: 200, message: "berhasil melakukan delete anime"})
  } catch (error) {
    console.log(error)    
    return res.status(403).json({status: "failed", code: 403, message: "gagal melakukan delete", description: "terjadi kesalahan, coba lagi nanti"})
  }
})

router.get('/search/:title', async (req,res) => {
  const title = req.params.title
  try {
    const datas = await ANIMES.findAll({
      where: {
        title: {[Op.substring]: `%${title}%`}
      }
    })
    return res.status(200).json({status: "success", code: 200, message: "hasil query dengan title "+title, animes: datas})
  } catch (error) {
    console.log(error)
    return res.status(403).json({status: "failed", code: 403, message: error.message })
  }
})

export default router;
