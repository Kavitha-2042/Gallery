import mongoose from "mongoose"

export const fileSchema = new mongoose.Schema({
    image:{
        type:String
    },
    email:{
        type:String
    }
})

export default mongoose.model("File_Details", fileSchema)