import express from "express";
import logger from "./logger/logger";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./apollo/schema";
import { userResolvers, userTypeDef } from "./apollo/user";
import { driverResolvers, driverTypeDefs } from "./apollo/driver";
import { bookingResolvers, bookingTypeDefs } from "./apollo/booking";
import { rideResolvers, rideTypeDefs } from "./apollo/ride";
import { templateResolvers, templateTypeDefs } from "./apollo/templateRide";

const cors = require("cors");
const PORT = process.env.API_PORT || 3000;

export default async function App() {
    const server = new ApolloServer({
        typeDefs: [typeDefs, userTypeDef, driverTypeDefs, bookingTypeDefs, rideTypeDefs, templateTypeDefs],
        resolvers: [userResolvers, driverResolvers, bookingResolvers, templateResolvers, rideResolvers],
    });
    await server.start();

    const app: any = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    //   app.use(cors({ origin: /\*|http:\/\/localhost:3000|http:\/\/localhost:3001|https:\/\/app.alapi.co|https:\/\/link.alapi.co|https:\/\/app.testalapi.co|https:\/\/link.testalapi.co/, credentials: true }));
    app.use(cors())

    app.get("/", (_req: any, res: any) => {
        res.send("working");
    });
    app.use(require("./routes"));

    server.applyMiddleware({ app });
    app.listen(PORT, function () {
        logger.log({
            level: "info",
            message: `listening on port ${PORT}: http://localhost:${PORT}`,
        });
    });


    return app;
}
