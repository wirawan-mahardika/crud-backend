import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcrypt'
import USERS from '../database/model/userModel.js'

const router = express.Router()

router.post('/signup', async (req,res) => {
    const { username, password, ...userDetail } = req.body

    if(username.length < 4) return res.status(403).json({msg: 'Username harus lebih dari 3 character'})
    if(username.length > 20) return res.status(403).json({msg: 'Username harus kurang dari 20 character'})

    if(password.length < 7) return res.status(403).json({msg: 'Username harus lebih dari 7 character'})
    if(password.length > 65) return res.status(403).json({msg: 'Username harus kurang dari 65 character'})

    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    userDetail.password = hashPassword
    userDetail.username = username

    try {
        await USERS.create(userDetail)
        return res.status(200).json({msg: "berhasil signup"})
    } catch (error) {
        let response = error.errors[0].message.split(' ')
        response = response[0]
        console.log(response)
        return res.status(500).json({msg: `${response} sudah terdaftar`})
    }
})

router.post('/login', async (req,res) => {
    const { username, password } = req.body
    const user = await USERS.findOne({where: {username}})

    if(!user) return res.status(401).json({msg: "Anda tidak terdaftar"})
    if(!(await bcrypt.compare(password, user.password))) return res.status(401).json({msg: "Password invalid"})

    const token = jwt.sign({username: username, email: user.email}, process.env.TOKEN, {expiresIn: '10s'})
    const refreshToken = jwt.sign({username: user.username, email: user.email}, process.env.REFRESH_TOKEN, {expiresIn: '5m'})

    res.cookie('token', token, {maxAge: 1000 * 15, signed: true})
    res.cookie('refreshToken', refreshToken, {maxAge: 1000 * 60 * 15, signed: true})

    return res.status(200).json({msg: "Berhasil login"})
})

router.get('/refreshToken', (req,res) => {
    const refreshToken = req.signedCookies.refreshToken

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.status(401).json({msg: err.message})
        const token = jwt.sign({username: user.username, email: user.email}, process.env.TOKEN, {expiresIn: '10s'})
        return res.status(200).cookie('token', token, {maxAge: 1000 * 60 * 15, signed: true}).json({msg: "Token Refreshed"})
    })
})

export default router