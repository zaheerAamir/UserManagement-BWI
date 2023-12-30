import mongoose from "mongoose";
import 'dotenv/config'


async function connectDB() {

    try {
        const URI = process.env.URI
        if (URI != undefined) {
            console.log(URI)
            await mongoose.connect(URI)


            console.log("[User UTIL] Connected to mongoDb");


        }
    } catch (error: any) {
        console.error('[User UTIIL] Error connecting to MongoDB:', error);

    }



}
export default connectDB