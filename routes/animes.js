import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/', (req,res) => {
    res.send('berhasil masuk ke endpoint terproteksi')
})

export default router