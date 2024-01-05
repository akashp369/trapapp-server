const CategoryDB = require('../models/categoryModel');
const response = require('../middlewares/responseMiddleware')
const asynchandler = require('express-async-handler')

// Create a new category
const createCategory = asynchandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return response.validationError(res, 'Name and Description are required for category creation.');
        }

        const category = new CategoryDB({ name, description });
        const savedCategory = await category.save();
        response.successResponse(res, savedCategory, 'Category created successfully.');
    } catch (error) {
        response.internalServerError(res, 'Internal Server Error');
    }
})

// Get all categories
const getAllCategories = asynchandler(async (req, res) => {
    try {
        const categories = await CategoryDB.find();
        response.successResponse(res, categories, 'All categories retrieved successfully.');
    } catch (error) {
        response.internalServerError(res, 'Internal Server Error');
    }
})

// Get a single category by ID
const getCategoryById = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response.validationError(res, "Id not found.")
        }
        const category = await CategoryDB.findById(id);
        if (!category) {
            return response.notFoundError(res, 'Category not found.');
        }
        response.successResponse(res, category, 'Category retrieved successfully.');
    } catch (error) {
        response.internalServerError(res, 'Internal Server Error');
    }
})


const updateCategory = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!id) {
            return response.validationError(res, "Id not found.")
        }
        if (!name || !description) {
            return response.validationError(res, 'Name and Description are required for category update.');
        }

        const updatedCategory = await CategoryDB.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return response.notFoundError(res, 'Category not found.');
        }

        response.successResponse(res, updatedCategory, 'Category updated successfully.');
    } catch (error) {
        response.internalServerError(res, 'Internal Server Error');
    }
})


const deleteCategory = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response.validationError(res, "Id not found.")
        }
        const deletedCategory = await CategoryDB.findByIdAndDelete(id);
        if (!deletedCategory) {
            return response.notFoundError(res, 'Category not found.');
        }

        response.successResponse(res, deletedCategory, 'Category deleted successfully.');
    } catch (error) {
        response.internalServerError(res, 'Internal Server Error');
    }
})

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
