import dotenv from "dotenv"
dotenv.config()
import express from "express"
import joi from "joi"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import multer from 'multer'
import middleware from "../Middleware/middleware"
import { ModifiedRequset } from "../interface"
import userModel from "../Model/userModel"
import forgotModel from "../Model/forgotModel"
import fileModel from "../Model/fileModel"

export const Signup = (req:ModifiedRequset, res:express.Response) =>{
    const {name, email, password, conpassword} = req.body

    const validation = joi.object({
        name:joi.string().alphanum().required(),
        email:joi.string().email().required(),
        password:joi.string().uppercase().min(8).max(20).required(),
        conpassword:password
    })

    validation.validateAsync({name,email,password,conpassword})
    .then((validateResponse)=>{
        userModel.find({email})
        .then((emailResponse)=>{
            if(emailResponse.length > 0){
                return res.json({message:"User already exist"})
            }
            if(conpassword !== password){
                return res.json({message:"Cofirm password doesn't match with password"})
            }
            bcryptjs.hash(password, 15)
            .then((hashPassword)=>{
                userModel.create({name,email,password:hashPassword})
                .then((createResponse)=>{
                    let token = jwt.sign({_id:createResponse._id}, process.env.SECRET_KEY as string)
                    return res.json({
                        message:"Signup Successful!",
                        auth:true,
                        user:createResponse,
                        token
                    })
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

export const Signin = (req:ModifiedRequset, res:express.Response) =>{
    const { email, password} = req.body

    const validation = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(8).max(20).uppercase().required()
    })

    validation.validateAsync({email,password})
    .then((validationResponse)=>{
        userModel.findOne({email})
        .then((emailResponse)=>{
            if(!emailResponse){
                return res.json({message:"User doesn't exist", auth:false, user:null})
            }
            bcryptjs.compare(password, emailResponse.password)
            .then((compareResult)=>{
                if(!compareResult){
                    return res.json({message:"Incorrect password",user:null, auth:false})
                }
                let token = jwt.sign({_id:emailResponse._id}, process.env.SECRET_KEY as string)
                return res.json({
                    message:"Signin successfull",
                    auth:true,
                    user:emailResponse,
                    token
                })
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

export const Status = (req:ModifiedRequset, res:express.Response) =>{
    if(!req.users){
        console.log("False")
        return res.json({
            message:"You're not logged in!",
            user:null,
            auth:false,
        })
    }
        console.log("true")
        return res.json({
            message:"You're logged in!!",
            auth:true,
            user:req.users,
            token:req.headers
        })
}

export const ChangePassword = (req:ModifiedRequset, res:express.Response) =>{
    const {newPassword, conNewPassword} = req.body
    
    const validation = joi.object({
        newPassword:joi.string().min(8).max(20).uppercase().required(),
        conNewPassword:newPassword
    })

    validation.validateAsync({newPassword, conNewPassword})
    .then((validationResult)=>{
        if(conNewPassword === newPassword){
            if(newPassword === req.users.password){
                return res.json({
                    message:"New password cannot be your old password",
                    auth:false
                })
            }
            else{
                bcryptjs.hash(newPassword, 15)
                .then((hashNewPassword)=>{
                    userModel.findByIdAndUpdate(req.users._id, {password:hashNewPassword})
                    .then((updateResponse)=>{
                        return res.json({
                            message:"New Password updated",
                            user:updateResponse,
                            auth:true
                        })
                    })
                    .catch(err=>console.log(err))
                })
                .catch(err=>console.log(err))
            }
        }else{
            return res.json({message:"Confirm Password does'nt match with Password", auth:false})
        }
    })
    .catch(err=>console.log(err)) 
}

function urlPattern(length:number){
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ""
    for(let i = 0; i < length; i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length-1))
    }
    return result
}

const transporter = nodemailer.createTransport({
    service:'sendinblue',
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASSWORD
    }
})

export const ForgotPassword = (req:ModifiedRequset, res:express.Response) =>{
    const {email} = req.body

    userModel.findOne({email})
    .then((emailResponse)=>{
        if(!emailResponse){
            return res.json({message:"User doesn't exist", auth:false})
        }
        const url = urlPattern(20)
        const creationTime = Date.now()
        const expirationTime = creationTime+5*60*1000

        forgotModel.create({url, email, creationTime, expirationTime})
        .then((forgotResponse)=>{
            // return res.json({
            //     message:"Forgot password link sent",
            //     forgotResponse,
            //     url:`/forgotpassword/${forgotResponse.url}`
            // })

            const mailObject = transporter.sendMail({
                from:process.env.AUTH_EMAIL,
                to:email,
                subject:"Forgot Password Link",
                text:`http://localhost:5000/user/forgotpassword/${forgotResponse.url}`
            })
            return res.json({
                message:"Link sent",
                redirection:null
            })

        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

export const ForgotPasswordURL = (req:ModifiedRequset, res:express.Response) =>{
    const url = req.params.forgotpassURL;

    forgotModel.findOne({url:url})
    .then((urlResponse:any)=>{
        if(urlResponse){
            let time = Date.now()
            if(time > urlResponse.expirationTime){
                forgotModel.deleteOne({url})
                .then((deleteResponse)=>{
                    return res.json({
                        message:"Link expired",
                        auth:false
                    })
                })
               .catch((err)=>{
                    return res.json({
                        message:"Some error occured"
                    })
               })
            }
        }
        else{
            const {newPassword, conNewPassword} = req.body

            const validation = joi.object({
                newPassword:joi.string().min(8).max(20).uppercase().required(),
                conNewPassword:newPassword
            })
            validation.validateAsync({newPassword, conNewPassword})
            .then((validationResponse)=>{
                if(newPassword === conNewPassword){
                    bcryptjs.hash(newPassword,15)
                    .then((hashNewPassword)=>{
                        userModel.updateOne({email:urlResponse.email},{password:hashNewPassword})
                        .then((updateResponse)=>{
                            return res.json({
                                message:"New password updated",
                                auth:true,
                                pass:updateResponse
                            })
                        })
                        .catch(err=>console.log(err))

                    })
                    .catch(err=>console.log(err))
                }
                else{
                    return res.json({message:"New Password and confirm new password are not same"})
                }
            })
            .catch(err=>console.log(err))
        }
    })
    .catch(err=>console.log(err))
}

const fileStorageEngine = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'Public/images')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"_"+file.originalname)
    }
})

export const upload = multer({storage:fileStorageEngine})

export const FileUpload = (req:ModifiedRequset, res:express.Response) =>{
    const {image} = req.body

    let newItem = {
        image: (req.files as Express.Multer.File[])[0].path,
        email:req.users.email
    }

    new fileModel(newItem).save()
    .then((fileResponse)=>{
        if(fileResponse){
            return res.json({
                message:"File uloaded",
                file:(req.files as Express.Multer.File[])[0].path,
                auth:true
            })
        }
    })
    .catch(err=>{return res.json({message:err})})
}

export const Allimages = (req:ModifiedRequset, res:express.Response) =>{
    fileModel.find({})
    .then((allResponse)=>{
        console.log("all response: ", allResponse)
        if(allResponse){
            return res.json({
                message:"ALl files listed",
                file:allResponse,
                auth:true
            })
        }
    })
    .catch(err=>console.log(err))
}

export const Myimages = (req:ModifiedRequset, res:express.Response) =>{
    const {email}= req.users

    userModel.findOne({email})
    .then((emailResponse)=>{
        fileModel.find(email)
        .then((fileResponse)=>{
            return res.json({
                message:"My files sent",
                file:fileResponse,
                auth:true
            })
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}