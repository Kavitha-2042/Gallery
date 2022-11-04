import mongoose from 'mongoose'

export const forgotSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    creationTime:{
        type:Number,
        required:true
    },
    expirationTime:{
        type:Number,
        required:true
    }
})
export default mongoose.model("Forgot_Details", forgotSchema)