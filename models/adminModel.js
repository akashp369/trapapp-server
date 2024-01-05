const mongoose=require("mongoose")


const adminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    batches:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Batch"
    },

},{timestamps:true})

const adminModel=mongoose.model("Admin",adminSchema);

module.exports=adminModel;