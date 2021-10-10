import { MikroORM } from '@mikro-orm/core'
import "reflect-metadata";
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
    //Connect to DB and run migrations
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({em: orm.em})
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