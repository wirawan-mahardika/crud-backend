import express from "express";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import usersRoute from "./routes/users.js";
import animesRoute from "./routes/animes.js";

dotenv.config()
const app = express()
const authJwt = (req,res,next) => {
    const token = req.signedCookies.token

    jwt.verify(token, process.env.TOKEN, (err, user) => {
        if(err) return res.status(401).json({msg: err.message})
        req.user = user
        next()
    })
}

app.use(cookieParser(process.env.COOKIE))
app.use(express.json())

app.use('/api/users', usersRoute)
app.use('/api/animes', authJwt, animesRoute)

app.listen(process.env.PORT, () => console.log('server is listening at port ' + process.env.PORT))