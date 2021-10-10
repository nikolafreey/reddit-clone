import { MikroORM } from '@mikro-orm/core'
import "reflect-metadata";
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';

const main = async () => {
    //Connect to DB and run migrations
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

//     app.use(
//     cors({
//       // origin: process.env.CLIENT_URL,
//       // credentials: true,
//       origin: "",
//       credentials: true,
//     })
//   );

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({client: redisClient, disableTouch: true}),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}) : MyContext => ({em: orm.em, req, res})
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({app});

    app.listen(4040, () => {
        console.log("App is listening on port: 4040")
    });
}

main().catch(err => {
    console.log(err);
});