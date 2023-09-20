import express from "express";
import{ registerController,logincontroller,testController,forgotPasswordController, updateProfileController, getOrdersControllers, getAllOrdersControllers, ordersStatusControllers} from "../controllers/authController.js";
import { requireSignIn ,isAdmin} from "../middlewares/authmiddleware.js";
const router = express.Router();
//register || post
router.post("/register",registerController);
router.post("/login",logincontroller)

//testroute
router.get("/test",requireSignIn,isAdmin,testController)
//forgotpassword
router.post("/forgot-password",forgotPasswordController)
//protected
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})
//update profile 
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersControllers)


//admin all orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersControllers)

//order status update

router.put('/order-status/:orderId',requireSignIn,isAdmin,ordersStatusControllers)

export default router;