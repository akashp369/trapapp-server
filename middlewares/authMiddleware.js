const jwt=require("jsonwebtoken")
const userDB=require("../models/userModel")
const adminDB=require("../models/adminModel")
require('dotenv').config();

const checkLogin=async(req,res,next)=>{
    var token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try {
            token=token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.decode(token);
            const user=await userDB.findById({_id:decoded.id})
            const {password,createdAt,updatedAt,...others}=user._doc;
            req.user=others;
            next();

        } catch (error) {
            res.status(400).json({message:"User not authorized"})
        }
    }
    else{
        res.status(400).json({message:"User not authorized"})
    }
}
const checkAdmin=async(req,res,next)=>{
    var token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            
            const decoded=jwt.decode(token);
            const admin=await adminDB.findById({_id:decoded.id});
            const {password,createdAt,updatedAt,...others}=admin._doc;
            req.admin=others;
            next();
        }catch(err){
            res.status(401).json({message: "Unauthorized, token failed"});
        }
    }else{
        res.status(401).json({message: "Admin not authorized"});
    }
}

module.exports={checkLogin,checkAdmin}