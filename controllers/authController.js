import { hashPassword ,comparePassword} from "../helpers/authHelper.js";
import userModels from "../models/userModels.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res)=>{
    try{
        const{name,email,password,phone,address,answer}= req.body
        if(!name){
            return res.send({message: 'name is required'})
        }
        if(!email){
            return res.send({message: 'email is required'})
        }
        if(!password){
            return res.send({message: 'password is required'})
        }
        if(!phone){
            return res.send({message: 'phone is required'})
        }
        if(!address){
            return res.send({message: 'address is required'})
        }
        if(!answer){
            return res.send({message: 'answer is required'})
        }

        //existing user
        const existingUser= await userModels.findOne({email})
        if(existingUser){
            return res.status(200).send({success:true,message:'already resgired plz login'})
        }

        //register user
        const hashedPassword= await hashPassword(password)

        const user= await new userModels({name,email,phone,address,password:hashedPassword,answer}).save()
        res.status(201).send({success:true,message:'user register sucessfully',user})
    }catch(error){
        console.log(error);
        res.status(500).send({success:false,message:'error in registration',error})
    }
}

export const logincontroller = async (req,res)=>{
    try{
        
        const {email,password}=req.body;

        if(!email || !password){
        return res.status(404).send({
            sucess:false,message:'invalid email or password'
        })}
        //check user
        
        const user =await userModels.findOne({email});

        if(!user)
        {
            return res.status(404).send({sucess:false,message:'email not found'})
        }
        
        const match =await comparePassword(password,user.password)

        if(!match){
            return res.status(200).send({
                success:false,
                message:'invalid password'
             })
        }
       
        //token 
        const token =  JWT.sign({user:{_id: user._id,email: user.email }}, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              role: user.role,
            },
            token,
          });

    }catch(error){
        console.log(error);
        res.status(507).send({
            sucess:false,
            message:'error in login',
            error
        })
    }
}

 //forgot password controller
 export const forgotPasswordController= async (req,res)=>{
    try{
        const {email,answer,newPassword}=req.body
        if(!email){
            res.status(500).send({message:'email is required'})
        }
        if(!answer){
            res.status(500).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(500).send({message:'newpassword is required'})
        }
    //check
    const user=await userModels.findOne({email,answer})
    if(!user){
        res.status(404).send({message:'wrong email and anser is required'})
    }
    const hashed =await hashPassword(newPassword)
    await userModels.findByIdAndUpdate(user.id,{password:hashed});
res.status(200).send({success:true,message:"password reset successfully "})
    }catch(error){
        res.status(500).send({success:false,message:'something went wronggggggg'})
    console.log(error)
    }
 }

export const testController=(req,res)=>{
    console.log('protected route');
}

//update profile
export const updateProfileController=async(req,res)=>{
    try{
        const {name,password,address,phone}=req.body;
        
       
        const user = await userModels.findById(req.user.user._id)
        if(password && password.length<6){
           return res.json({error: 'password is required and 6 character long'})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModels.findByIdAndUpdate(req.user._id,{
            name: name||user.name,
            password: hashedPassword || user.password,
            phone: phone|| user.phone,
            address: address|| user.address
        },{new:true})
    
res.status(200).send({success:true,message:"Updated successfully ",updatedUser})
    }catch(error){
        res.status(500).send({success:false,message:'something went wronggggggg'})
    console.log(error)
    }

}

export const getOrdersControllers=async(req,res)=>{
    try{
       const orders= await orderModel.find({buyer:req.user._id}).populate('products','-photo').populate('buyer','name')
       res.json(orders)
    }catch(error){
        res.status(500).send({success:false,message:'error while getting order'})
    console.log(error)
    }

}

export const getAllOrdersControllers=async(req,res)=>{
    try{
       const orders= await orderModel.find({}).populate('products','-photo').populate('buyer','name').sort({createdAt:'-1'})
       res.json(orders)
    }catch(error){
        res.status(500).send({success:false,message:'error while getting order'})
    console.log(error)
    }

}

export const ordersStatusControllers=async(req,res)=>{
    try{
       
        const { orderId}=req.params
        const { status}= req.body
        const orders =await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)

    }catch(error){
        res.status(500).send({success:false,message:'error while updating status order'})
    console.log(error)
    }

}