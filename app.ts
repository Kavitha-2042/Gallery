import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import userRouter from "./Route/userRoute"
import cors from 'cors'

const app:express.Application = express()

app.use(cors({
    credentials:true,
    origin:"http://localhost:3000",
    methods:["GET", "POST"]
}))

app.use('/Public',express.static('Public'))

app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/user', userRouter)

mongoose.connect(process.env.MONGOOSE_URL as string,()=>{
    console.log("DB connected")
    app.listen(process.env.PORT_NUMBER,()=>{
        console.log(`Server runs on port ${process.env.PORT_NUMBER}`)
    })
})
