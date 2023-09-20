import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path'
dotenv.config();
connectDB();
 const app = express();
app.use(cors());
 app.use(express.json())
 app.use(morgan('dev'))
 app.use(express.static(path.join(__dirname,'./client/build')))
app.use('/api/v1/product',productRoutes)
 app.use('/api/v1/auth',authRoutes);
 app.use('/api/v1/category',categoryRoutes)

 app.use('*',function(req,res){
   res.sendFile(path.join(__dirname,'./client/build/index.html'))
 })
 app.get("/",(req,res)=>{
    res.send({message: "welcome guys"})
   })

const PORT = process.env.PORT;
 app.listen(PORT,()=>{
    console.log(`server running ${PORT}`.bgCyan);
 })