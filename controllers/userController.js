const userDB = require("../models/userModel");
const productDB = require("../models/productModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

//signup
const userRegister = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return response.validationError(res, 'Cannot create account without proper details');
    };
    const findEmail = await userDB.findOne({ email: email });
    if (findEmail) {
        return response.errorResponse(res, "Account already exists.Please login", 400);
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = new userDB({
        name: name,
        email: email,
        password: hashedPassword
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
        return response.internalServerError(res, "Failed to save the user");
    }
    const token = jwt(savedUser._id);
    const finalRes = {
        token: token,
        user: savedUser
    }
    response.successResponse(res, finalRes, 'Successfully created the admin');
})



//login
const loginUser=asynchandler(async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return response.validationError(res,"Cannot login without proper information");
    }
    const findEmail = await userDB.findOne({ email: email }).populate("scanHistory");
    if (!findEmail) {
        return response.notFoundError(res, "Cannot find the user. Please Signup");
    }
    const comparePassword = await bcrypt.compare(password, findEmail.password);
    if (!comparePassword) {
        response.errorResponse(res, "Incorrect password", 400);
    }

    const token = jwt(findEmail._id);
    const finalRes = {
        token: token,
        user: findEmail
    }
    response.successResponse(res, finalRes, 'Login successful');
})



//get a product and update quantity
const updateScan=asynchandler(async(req,res)=>{
    const {id}=req.params;
    const userId=req.user._id;
    if(id==":id"){
        return response.validationError(res,"Cannot find the product without the id");
    }
    const findProduct=await productDB.findById({_id:id,isActive:true});
    if(!findProduct){
        return response.notFoundError(res,"Cannot find the product");
    }
    if(findProduct.quantity==0){
        return response.internalServerError(res,"Error in scanning");
    }
    findProduct.quantity=findProduct.quantity-1;
    const findUser=await userDB.findByIdAndUpdate({_id:userId},{
        $push:{scanHistory:id}
    });
    if(!findUser){
        return response.internalServerError(res,"Error in scanning");
    }
    await findProduct.save();
    response.successResponse(res,findProduct,'Fetched product successfully');
})


module.exports={userRegister,loginUser,updateScan}