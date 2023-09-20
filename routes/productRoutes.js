import express from 'express'
import {isAdmin, requireSignIn} from '../middlewares/authmiddleware.js'
import { ProductDeleteController, braintreePaymentController, braintreeTokenController, createProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js'
import formidable from 'express-formidable';

const router = express.Router()


router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
router.get('/get-product',getProductController)
router.get('/get-product/:slug',getSingleProductController)
router.get('/product-photo/:pid',productPhotoController)
router.delete('/product-delete/:pid',ProductDeleteController)
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)

//filter product
router.post('/product-filters',productFiltersController)

//product-count
router.get('/product-count',productCountController)

//product per page

router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

router.get('/product-category/:slug',productCategoryController)

// payment route
//token route
router.get('/braintree/token',braintreeTokenController)

//payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController)
export default router
