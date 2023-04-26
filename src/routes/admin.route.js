import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

router.post('/',(req,res) => {
        const { name, email, goal, language } = req.body
        if(name === "wirawan" && email === 'wirawanmahardika10@gmail.com' && goal === "technical architect" && language === "golang") {
            const token = jwt.sign({name, email}, process.env.JWT_SECRET, {expiresIn: '15s'})
            const refreshToken = jwt.sign({name, email}, process.env.REFRESH_JWT_SECRET, {expiresIn: '15s'})

            res.cookie('token', token, {maxAge: 1000*15, signed: true, httpOnly: true})
            res.cookie('refreshToken', refreshToken, {maxAge: 1000*3600, signed: true, httpOnly: true})
            
            return res.status(200).json({code: 200, message: "Welcome admin"})
        } else {
            return res.status(401).json({code: 401, message: "Anda tidak teridentifikasi sebagai admin"})
        }
    })

router.get('/refreshToken', (req,res) => {
    const refreshToken = req.signedCookies['refreshToken']
    
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, {name,email}) => {
        if(err) return res.status(401).json({code: 401, message: err.message})
        const token = jwt.sign({name, email}, process.env.JWT_SECRET, {expiresIn: '15s'})
        res.cookie('token', token, {maxAge: 1000*15, signed: true, httpOnly: true})
        return res.status(200).json({code: 200, message: "berhasil perbarui"})
    })
})

export default router