import mongoose, { ConnectOptions } from "mongoose";
import logger from "../logger/logger";

require("dotenv").config();

const connection: string = process.env.DB_STRING as string;

// Connect to the correct environment database
export default function connectMongo(callback: () => void) {
    mongoose.set("strictQuery", false);
    mongoose.connect(connection, {
        socketTimeoutMS: 0,
        connectTimeoutMS: 0,
    } as ConnectOptions);

    mongoose.connection.on("connected", () => {
        logger.log({
            level: "info",
            message: `Mongoose Database connected`,
        });
        callback();
    });
}
