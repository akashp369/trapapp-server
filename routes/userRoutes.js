const { userRegister, loginUser, updateScan } = require("../controllers/userController");

const router=require("express").Router();

const {checkLogin}=require("../middlewares/authMiddleware")




router.post("/register",userRegister);
router.post("/login",loginUser);
router.post("/getproduct/:id",checkLogin,updateScan);


module.exports=router;