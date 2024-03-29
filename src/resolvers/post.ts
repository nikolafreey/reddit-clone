import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    posts(
        @Ctx() ctx: MyContext
    ) : Promise<Post[]> {
        return ctx.em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number, 
        @Ctx() {em}: MyContext
    ) : Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
        @Ctx() {em}: MyContext
    ) : Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if(!post){
            return null;
        }
        if(typeof title !== "undefined"){
            post.title = title;
            await em.persistAndFlush(post);
        }

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext
    ) : Promise<Boolean> {
        await em.nativeDelete(Post, {id});
        return true;
    }
}