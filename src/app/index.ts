import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';


import {User} from './user'
import {Post} from './post'
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

async function initServer(){
    const app = express();

    app.use(bodyParser.json())
    app.use(cors())

    const server = new ApolloServer<GraphqlContext>({
        typeDefs : `
            ${User.types}
            ${Post.types}
            type Query { 
               ${User.queries}
               ${Post.queries}
            }
            type Mutation {
                ${Post.mutations}
            }
        ` ,
        resolvers : {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries,
            },
            Mutation: {
                ...Post.resolvers.mutations,
            },
            ...Post.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        },
    });

    await server.start()

    app.use('/graphql' , expressMiddleware(server , {
        context: async({req , res}) => {
            return {
              user: req.headers.authorization
                ? JWTService.decodeToken (
                    req.headers.authorization.split("Bearer ")[1]
                  )
                : undefined,
            };
        }
    }));

    return app;

}

export default initServer;