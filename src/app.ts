import express from "express";
import logger from "./logger/logger";
import { ApolloServer } from '@apollo/server';
import { typeDefs } from "./apollo/schema";
import { expressMiddleware } from '@apollo/server/express4';
import { shield } from 'graphql-shield';
import { userPermissions, userResolvers, userTypeDef } from "./apollo/user";
import { driverPermissions, driverResolvers, driverTypeDefs } from "./apollo/driver";
import { bookingPermissions, bookingResolvers, bookingTypeDefs } from "./apollo/booking";
import { rideResolvers, rideTypeDefs } from "./apollo/ride";
import { templateResolvers, templateRidePermissions, templateTypeDefs } from "./apollo/templateRide";
import { locationTypeDefs } from "./apollo/location";
import { prmoPermissions, promoResolvers, promoTypeDefs } from "./apollo/promo";
import apolloMiddleware from "./middlewares/apolloMiddle";
import { applyMiddleware } from "graphql-middleware";
import { buildSubgraphSchema } from "@apollo/subgraph/dist/buildSubgraphSchema";

const cors = require("cors");
const PORT = process.env.API_PORT || 3000;

export default async function App() {
    const server = new ApolloServer({
        schema: applyMiddleware(
            buildSubgraphSchema([
                { typeDefs: userTypeDef, resolvers: userResolvers },
                { typeDefs: driverTypeDefs, resolvers: driverResolvers },
                { typeDefs: bookingTypeDefs, resolvers: bookingResolvers },
                { typeDefs: rideTypeDefs, resolvers: rideResolvers },
                { typeDefs: templateTypeDefs, resolvers: templateResolvers },
                { typeDefs: promoTypeDefs, resolvers: promoResolvers },
                { typeDefs: locationTypeDefs },
                { typeDefs }]),
            userPermissions,
            driverPermissions,
            bookingPermissions,
            templateRidePermissions,
            prmoPermissions,
        ),
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
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: apolloMiddleware,


        },),
    );

    app.listen(PORT, function () {
        logger.log({
            level: "info",
            message: `listening on port ${PORT}: http://localhost:${PORT}`,
        });
    });


    return app;
}
