import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";


async function connectDB() {
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();
    
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(getUri);
    console.log("Database connected");

    return db;
}

export default connectDB;