const { register, login, createBatch, getAllBatches, getBatch, updateBatch, deleteBatch, createProduct, getProducts, getSingleProduct, updateProduct, updateProductStatus, transferProduct, deleteProduct } = require("../controllers/adminController");

const router=require("express").Router();
const upload=require("../utils/multer");
const {checkAdmin}=require("../middlewares/authMiddleware");

router.post("/register",register);
router.post("/login",login);
router.post("/create/batch",checkAdmin,createBatch);
router.get("/getallbatches",getAllBatches);
router.get("/getbatch/:id",getBatch);
router.put("/updatebatch/:id",updateBatch);
router.delete("/deletebatch/:id",deleteBatch);
router.post("/create/product",upload.single("image"),createProduct);
router.get("/getallproducts",getProducts);
router.get("/getproduct/:id",getSingleProduct);
router.put("/updateproduct/:id",upload.single("image"),updateProduct);
router.put("/updateproductstatus/:id",updateProductStatus);
router.post("/transferproduct",transferProduct);
router.delete("/deleteproduct/:id",deleteProduct);


module.exports=router;