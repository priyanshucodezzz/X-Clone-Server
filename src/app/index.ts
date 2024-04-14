import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from '../clients/db';


import {User} from './user'

async function initServer(){
    const app = express();

    app.use(bodyParser.json())
    app.use(cors())

    const server = new ApolloServer({
        typeDefs : `
            ${User.types}
            type Query { 
               ${User.queries}
            }
        ` ,
        resolvers : {
            Query: {
                ...User.resolvers.queries,
            },
        },
    });

    await server.start()

    app.use('/graphql' , expressMiddleware(server));

    return app;

}

export default initServer;