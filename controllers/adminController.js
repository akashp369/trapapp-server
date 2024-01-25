const adminDB = require("../models/adminModel");
const batchDB = require("../models/batchModel");
const productDB = require("../models/productModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");
//signup
const register = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return response.validationError(res, 'Cannot create account without proper details');
    };
    const findEmail = await adminDB.findOne({ email: email });
    if (findEmail) {
        return response.errorResponse(res, "Account already exists.Please login", 400);
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newAdmin = new adminDB({
        name: name,
        email: email,
        password: hashedPassword
    });
    const savedAdmin = await newAdmin.save();
    if (!savedAdmin) {
        return response.internalServerError(res, "Failed to save the admin");
    }
    const token = jwt(savedAdmin._id);
    const finalRes = {
        token: token,
        user: savedAdmin
    }
    response.successResponse(res, finalRes, 'Successfully created the admin');

})


//login
const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return response.validationError(res, 'Cannot login without proeper details');
    }
    const findEmail = await adminDB.findOne({ email: email }).populate("batches");
    if (!findEmail) {
        return response.notFoundError(res, "Cannot find the user. Please login");
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

//create batch
const createBatch = asynchandler(async (req, res) => {
    const id = req.admin._id;
    const { batchName } = req.body;
    if (!batchName) {
        return response.validationError(res, 'Cannot create batch without batchname');
    }
    const newBatch = new batchDB({
        adminId: id,
        batchName: batchName
    })
    const savedBatch = await newBatch.save();
    if (!savedBatch) {
        return response.internalServerError(res, "Error in creating batch");
    }
    response.successResponse(res, savedBatch, 'Batch created successfully');
})


//get all batches
const getAllBatches = asynchandler(async (req, res) => {
    const { adminId } = req.query;
    const queryObj = {};
    if (adminId) {
        queryObj.adminId = adminId;
    }
    try {
        const findBatches = await batchDB.find(queryObj).populate("products");
        if (!findBatches) {
            return response.internalServerError(res, "Failed to fetch the data");
        }
        response.successResponse(res, findBatches, 'fetched the batches successfully');
    } catch (error) {
        console.log(error)
        response.internalServerError(res, 'Error occured');
    }
})

//get a batch
const getBatch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, "cannot fetch the data without the id");
    }
    const findbatch = await batchDB.findById({ _id: id }).populate("products");
    if (!findbatch) {
        return response.notFoundError(res, "Cannot find the batch");
    }
    response.successResponse(res, findbatch, 'Successfully fetched the data');
})

//edit batch
const updateBatch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, "cannot fetch the data without the id");
    }
    const findbatch = await batchDB.findById({ _id: id }).populate("products");
    if (!findbatch) {
        return response.notFoundError(res, "Cannot find the batch");
    }
    const { batchName } = req.body;
    if (batchName) {
        findbatch.batchName = batchName;
    }
    await findbatch.save();
    response.successResponse(res, findbatch, 'Successfully updated the batch');
})


//delete batch
const deleteBatch = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, "cannot fetch the data without the id");
    }
    const findbatch = await batchDB.findById({ _id: id }).populate("products");
    if (!findbatch) {
        return response.notFoundError(res, "Cannot find the batch");
    }
    const deletedBatch = await batchDB.findByIdAndDelete({ _id: findbatch._id });
    if (!deletedBatch) {
        return response.internalServerError(res, 'Error in deleting the batch');
    }
    response.successResponse(res, deletedBatch, 'Deleted branch successfully');
})


//create product
const createProduct = asynchandler(async (req, res) => {
    const { productName, productDescription, quantity, productType, category, color, batch, website, instagram,youtube } = req.body;
    if (!productName || !productDescription) {
        return response.validationError(res, "Cannot create productt without proper information");
    }
    try {
        var productImage;
        if (req.file) {
            const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "trapApp"
            })
            if (!uploadedFile) {
                return response.errorResponse(res, "Failed to upload the image");
            }
            productImage = uploadedFile.secure_url;
        }
        const newProduct = new productDB({
            productName: productName,
            productDescription: productDescription,
            // quantity: parseInt(quantity),
            productType: productType,
            category: category,
            color: color,
            // batch: batch,
            productImage,
            website,
            instagram,
            youtube
        })
        const savedProduct = await newProduct.save();
        if (!savedProduct) {
            return response.internalServerError(res, "Failed to create the product");
        }
        // const findbatch = await batchDB.findByIdAndUpdate({ _id: batch }, {
        //     $push: { products: newProduct._id }
        // }, { new: true })
        // if (!findbatch) {
        //     return response.internalServerError(res, "Error in creating product");
        // }
        response.successResponse(res, savedProduct, 'Error in saving product');
    } catch (error) {
        console.log(error);
        response.internalServerError(res, "ERROR OCCURED");
    }
})


//get all product from a particular batch
const getProducts = asynchandler(async (req, res) => {
    const { batchId } = req.query;
    const queryObj = {};
    if (batchId) {
        queryObj.batch = batchId;
    }
    const findAllProducts = await productDB.find(queryObj).populate("batch");
    if (!findAllProducts) {
        return response.internalServerError(res, "error in fetching the products");
    }
    response.successResponse(res, findAllProducts, 'Fetched the product successfully');
})


//get a product

const getSingleProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'Cannot fidnn the product without id');
    }
    const findProduct = await productDB.findById({ _id: id }).populate("batch");
    if (!findProduct) {
        return response.notFoundError(res, "failed to find the product");
    }
    response.successResponse(res, findProduct, 'Fetched the product succesfully');

})



//update product
const updateProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'Cannot fidnn the product without id');
    }
    const findProduct = await productDB.findById({ _id: id }).populate("batch");
    if (!findProduct) {
        return response.notFoundError(res, "failed to find the product");
    }
    const { productName, productDescription, quantity, productType, category, color, website, instagram, youtube } = req.body;
    if (productName) {
        findProduct.productName = productName;
    }
    if (productDescription) {
        findProduct.productDescription = productDescription;
    }
    if (quantity) {
        findProduct.quantity = quantity;
    }
    if (productType) {
        findProduct.productType = productType;
    }
    if (category) {
        findProduct.category = category;
    }
    if (color) {
        findProduct.color = color;
    }
    if (website) {
        findProduct.website = website;
    }
    if (instagram) {
        findProduct.instagram = instagram;
    }
    if (youtube) {
        findProduct.youtube = youtube;
    }
    if(req.file){
        const uploadedFile=await cloudinary.uploader.upload(req.file.path,{
            folder:"trapApp"
        })
        findProduct.productImage=uploadedFile.secure_url;
    }
    await findProduct.save();
    response.successResponse(res, findProduct, 'Updated the product successfully');
})


//update product status
const updateProductStatus = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'Cannot fidnn the product without id');
    }
    const { status } = req.body;
    if (status == undefined) {
        return response.validationError(res, "Cannot update status without the status");
    }
    const findProduct = await productDB.findById({ _id: id }).populate("batch");
    if (!findProduct) {
        return response.notFoundError(res, "failed to find the product");
    }
    findProduct.isActive = status;
    await findProduct.save();
    response.successResponse(res, findProduct, "Updated product successfully");
})



//transfer product from one batch to other
const transferProduct = asynchandler(async (req, res) => {
    const { toTransferId, fromTransferId, productId } = req.body;
    if (!toTransferId || !fromTransferId) {
        return response.validationError(res, "Cannot transfer wiithout the batchIds");
    }
    const fromBatch = await batchDB.findById({ _id: fromTransferId }).populate("products");
    if (!fromBatch) {
        return response.notFoundError(res, "From batch not found");
    }
    const toBatch = await batchDB.findById({ _id: toTransferId }).populate("products");
    if (!toBatch) {
        return response.notFoundError(res, "To bbatch not found");
    }
    if(!productId){
        toBatch.products = [...toBatch.products, ...fromBatch.products];
        fromBatch.products = [];
    }
    else{
        const findIndex=fromBatch.products.findIndex(obj=>obj._id.toString()==productId.toString());
        if(findIndex>-1){
            // console.log(fromBatch.products[findIndex])
            toBatch.products=[...toBatch.products,fromBatch.products[findIndex]._id];
            fromBatch.products.splice(findIndex,1);
        }
    }
    await toBatch.save();
    await fromBatch.save();
    response.successResponse(res, fromBatch, "Tranfered product successfully");
})


//delete product

const deleteProduct = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'Cannot fidnn the product without id');
    }
    const findProduct = await productDB.findById({ _id: id }).populate("batch");
    if (!findProduct) {
        return response.notFoundError(res, "failed to find the product");
    }
    const deletedProduct = await productDB.findByIdAndDelete({ _id: id });
    if (!deletedProduct) {
        return response.internalServerError(res, "failed to delete the product");
    }
    // const updateBatch = await batchDB.findByIdAndUpdate({ _id: deletedProduct.batch }, {
    //     $pull: { products: deletedProduct._id }
    // });
    // if (!updateBatch) {
    //     return response.successResponse(res, deletedProduct, "Deleted product but failed to update the batch");
    // }
    response.successResponse(res, deletedProduct, "Deleted product successfully");
})

module.exports={register,login,createBatch,getAllBatches,getBatch,updateBatch,deleteBatch,createProduct,getProducts,getSingleProduct,updateProduct,updateProductStatus,transferProduct,deleteProduct};