
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
    Variables: {
        userId: string,
    }
}>();
//my post request not getting hit what to do ?
//my post request not getting hit what to do ?


blogRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        return c.json({ error: "unauthorized" }, 401);
    }
    const token = jwt.split(' ')[1];
    const payload = await verify(token, c.env.JWT_SECRET) as { id: string };
    if (!payload) {
        return c.json({ error: "unauthorized" }, 401);
    }
    c.set('userId', payload.id);
    console.log("calling next");
    await next();
    console.log("Returned from next");
});

// POST route to create a new blog post
blogRouter.post('/myreq', async (c) => {
    console.log("POST route hit");
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
            },
        });
        return c.json({ id: post.id });
    } catch (e) {
        return c.json({ message: "unable to create post" }, 500);
    }
});


blogRouter.get('/bulk',async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    
    const posts = await prisma.post.findMany({});

    return c.json(posts);
    
})


  blogRouter.get('/myGetReq/:id',async (c) => {
    console.log("enter geet")
    const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});
    return c.json(post);
  })


  blogRouter.post('/test', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const testQuery = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected:', testQuery);
    return c.text('Database is fine!');
});

