import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
    //Connect to DB and run migrations
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false,
        })
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