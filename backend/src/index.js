import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
// Create the main Hono app
const app = new Hono();
app.post('/api/v1/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password
            }
        });
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    }
    catch (e) {
        c.status(403);
        return c.json({ error: "error while signing up" });
    }
});
app.post('/api/v1/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });
    if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
});
app.get('/api/v1/blog/:id', (c) => {
    const id = c.req.param('id');
    console.log(id);
    return c.text('get blog route');
});
app.post('/api/v1/blog', (c) => {
    return c.text('signin route');
});
app.put('/api/v1/blog', (c) => {
    return c.text('signin route');
});
export default app;
/*
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTMzYjhmMWUtMjczMi00NWZmLWE0YmQtYTBmMTNiMWI3ZTNlIiwidGVuYW50X2lkIjoiM2E1OGQ5YjA4M2JiNTc4YmViMDNhMGYzYTYwM2U4NWJlZDhjNjgyMGYzZmFjOGE0ZWFkY2ZhYWQ5Y2MxZDlkZiIsImludGVybmFsX3NlY3JldCI6IjQyMzE5Mjc1LTcxMDEtNDZhNi05ODdlLWMwYWIyMjI1NDlkMCJ9.iX706IhuuolwAnH3ifa373Qzk_KcF-33yEU977p-ZQk"
PULSE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTMzYjhmMWUtMjczMi00NWZmLWE0YmQtYTBmMTNiMWI3ZTNlIiwidGVuYW50X2lkIjoiM2E1OGQ5YjA4M2JiNTc4YmViMDNhMGYzYTYwM2U4NWJlZDhjNjgyMGYzZmFjOGE0ZWFkY2ZhYWQ5Y2MxZDlkZiIsImludGVybmFsX3NlY3JldCI6IjQyMzE5Mjc1LTcxMDEtNDZhNi05ODdlLWMwYWIyMjI1NDlkMCJ9.iX706IhuuolwAnH3ifa373Qzk_KcF-33yEU977p-ZQk"

*/
//
