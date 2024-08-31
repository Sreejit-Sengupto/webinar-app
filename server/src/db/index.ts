import mongoose from "mongoose";
import { DB_NAME } from "../constants/dbName";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI!}${DB_NAME}`)
        if (!connection) {
            console.log('Connection to MongoDB failed');
            process.exit(1);
        }
        console.log(`MongoDb connected successfully\n`);
        console.log(`Connection host: ${connection.connection.host}`);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDb;