const router = require('express').Router()
const categoryController = require('../controllers/categoryController')


router.post('/create', categoryController.createCategory);
router.get('/all', categoryController.getAllCategories);
router.get('/single/:id', categoryController.getCategoryById);
router.patch('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory)



module.exports = router;


