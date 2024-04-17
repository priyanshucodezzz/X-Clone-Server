import { prismaClient } from "../../clients/db";
import {Post} from "@prisma/client"
import { GraphqlContext } from "../../interfaces";

interface CreatePostPayload {
  content: string;
  imageUrl?: string;
}

const queries = {
  getAllPosts: () => prismaClient.post.findMany({orderBy:{createdAt:"desc"}})
}

const mutations = {
  createPost: async (
    parent: any,
    { payload }: { payload: CreatePostPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You must be logged in to create a post");

    const post = await prismaClient.post.create({
      data: {
        content: payload.content,
        imageUrl: payload.imageUrl ? payload.imageUrl : "",
        owner: { connect: { id: ctx.user.id } },
      },
    });

    return post;
  },
};

const extraResolvers = {
    Post: {
      owner: (parent: Post) => {
        return prismaClient.user.findUnique({ where: { id: parent.ownerId } });
      },
    }
};

export const resolvers = {queries, mutations , extraResolvers};
