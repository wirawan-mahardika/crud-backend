import express from "express";
import animeRoutes from "./routes/animes.route.js";
import adminRoute from './routes/admin.route.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express();

function jwtAuth(req,res,next)  {
    const token = req.signedCookies['token']
    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if(err) return res.status(401).json({code: 401, message: err.message})
        req.admin = admin
        next()
    })
}
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req,res, next) => {
    res.set('content-type', 'application/json')
    next()
})

app.use('/api/admin', adminRoute)
app.use("/api/animes", jwtAuth, animeRoutes);

app.use((err,req,res,next) => {
    if(err) {
        return res.status(500).json({code: 500, message: "internal server error", error: err})
    }
})

export default app;
