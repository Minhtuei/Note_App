import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { typeDefs } from "./schemas/index.js";
import { resolvers } from "./resolvers/index.js";
import mongoose from "mongoose";
import "dotenv/config.js";
import "./firebaseConfig.js";

import { getAuth } from "firebase-admin/auth";

const app = express();
const httpServer = http.createServer(app);

//schema: Document mo ta du lieu
//typeDefs: Document mo ta cac query, mutation, subscription

//resolver: Cac ham xu ly cac query, mutation, subscription

// Connect to database
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ehhwz9y.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

const authorizationJWT = async (req, res, next) => {
    console.log({ authorization: req.headers.authorization });
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];

        getAuth()
            .verifyIdToken(accessToken)
            .then((decodedToken) => {
                //console.log({ decodedToken });
                res.locals.uid = decodedToken.uid;
                next();
            })
            .catch((err) => {
                console.log({ err });
                return res
                    .status(403)
                    .json({ message: "Forbidden", error: err });
            });
    } else {
        next();
        // return res.status(401).json({ message: 'Unauthorized' });
    }
};

app.use(
    cors(),
    authorizationJWT,
    bodyParser.json(),
    expressMiddleware(server, {
        context: ({ req, res }) => {
            return {
                uid: res.locals.uid,
            };
        },
    })
);
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("Connected to database");
        await new Promise((resolve) =>
            httpServer.listen({ port: PORT }, resolve)
        );
        console.log(`🚀 Server ready at http://localhost:4000`);
    });
