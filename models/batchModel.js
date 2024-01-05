const mongoose=require("mongoose")

const batchSchema=mongoose.Schema({
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },
    batchName:{
        type:String,
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]

},{timestamps:true})


const batchModel=mongoose.model("Batch",batchSchema)

module.exports=batchModel;

