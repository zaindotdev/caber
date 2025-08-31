import mongoose from "mongoose";

export const connect = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}