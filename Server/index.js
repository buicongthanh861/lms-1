import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from './routes/user.route.js'
import courseRoute from './routes/course.route.js'
import mediaRoute from './routes/media.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()


const app = express()

const PORT = process.env.PORT || 3000

// default middlewere
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))


//api routes
app.use("/api/v1/user",userRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/media",mediaRoute)


app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is running ${PORT}`)

    
})