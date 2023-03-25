import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers";
// import { verifyJwt } from "./utils/jwt";
// import { User } from "./schema/user.schema";
// import Context from "./types/context";
// import authChecker from "./utils/authChecker";
import { connectToMongo } from "./utils/dbConnection";
import { Redis } from "ioredis";
// import connectRedis from "connect-redis";
import session, { Store } from "express-session";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constent/constent";
import connectRedis from "connect-redis";
// import {
//   ApolloServerPluginLandingPageGraphQLPlayground,
//   ApolloServerPluginLandingPageProductionDefault,
// } from "apollo-server-core"

async function bootstrap() {
  // Build the schema
  const corsOptions = {
    origin: ["http://localhost:5173","*"],
    credentials: true
  };
  const schema = await buildSchema({
    resolvers,
    validate: false,
    //authChecker,
  });

  // Init express
  const app = express();
  // const RedisClient = connectRedis(session);

  const RedisStore = connectRedis(session); // create a RedisStore instance

  const redisClient = new Redis(process.env.REDIS_URL!);

  redisClient.on("error", (err) => {
    console.log("Redis error:", err);
  });

  const redisStore: Store = new RedisStore({
    client: redisClient,
    disableTouch: true,
  });
  // const redis = new Redis(process.env.REDIS_URL!);
  // const redisStore = new (session as any).RedisStore({ // create a RedisStore instance
  //   client: redis,
  // });
  app.set("trust proxy", 1);
  // app.use(function(_, res, next) {
  //   // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   // res.header(
  //   //   'Access-Control-Allow-Headers',
  //   //   'Origin, X-Requested-With, Content-Type, Accept'
  //   // );
  //   res.header("Access-Control-Allow-Origin"," https://studio.apollographql.com")
  //   res.header("Access-Control-Allow-Credentials","true")
  //   next();
  // });
  app.use(
    cors(corsOptions)
  );
  // const store =  new RedisClient({
  //   client: redis,
  //   disableTouch: true,
  // })
  // let redisStore = new RedisStore({
  //   client: redis,
  //   prefix: "myapp:",
  // })
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        // domain: __prod__ ? ".codeponder.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  app.use(cookieParser());

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    // formatError: (error) => error,
    context: ({ req, res }) => ({
      req,
      res,
      redis:redisClient,
      // userLoader: createUserLoader(),
      // updootLoader: createUpdootLoader(),
    }),
    // plugins: [
    //   process.env.NODE_ENV === "production"
    //     ? ApolloServerPluginLandingPageProductionDefault()
    //     : ApolloServerPluginLandingPageGraphQLPlayground(),
    // ],
    
  });

  await server.start();
  // apply middleware to server

  server.applyMiddleware({ app,cors:corsOptions });

  // app.listen on express server
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on http://localhost:4000/graphql");
  });
  await connectToMongo();
}

bootstrap();
