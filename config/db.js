import mongoose from "mongoose";

 const connectDB = async ()=>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongoDb ${conn.connection.host}`.bgMagenta);
    }catch(error){
        console.log(`error in mongodb ${error}`.bgRed)

    }
 }
 export default connectDB;