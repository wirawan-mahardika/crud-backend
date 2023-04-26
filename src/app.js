import express from "express";
import animeRoutes from "./routes/animes.route.js";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req,res, next) => {
    res.set('content-type', 'application/json')
    next()
})

app.use('/api/admin')
app.use("/api/animes", animeRoutes);

app.use((err,req,res,next) => {
    if(err) {
        return res.status(500).json({code: 500, message: "internal server error"})
    }
})

export default app;
