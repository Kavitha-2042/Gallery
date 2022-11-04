import express from "express"

import { ModifiedRouter } from "../interface"
import * as userController from '../Controller/userController'
import middleware from "../Middleware/middleware"
import { upload } from "../Controller/userController"

const userRouter:ModifiedRouter = express.Router()

userRouter.post("/signup", middleware, userController.Signup)
userRouter.post("/signin", middleware, userController.Signin)
userRouter.get("/status", middleware, userController.Status)
userRouter.post('/changepassword', middleware, userController.ChangePassword)
userRouter.post('/forgotpassword', middleware, userController.ForgotPassword)
userRouter.post('/forgotpassword/:forgotpassURL', middleware, userController.ForgotPasswordURL)
userRouter.post('/fileupload', middleware, upload.array('image',20) , userController.FileUpload)
userRouter.get('/allimages', middleware, upload.array('image', 20), userController.Allimages)
userRouter.get('/myimages', middleware, upload.array('image',20), userController.Myimages)

export default userRouter