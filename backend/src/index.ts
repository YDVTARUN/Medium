import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();
app.route("/api/v1/user",userRouter);
app.route('/api/v1/blog', blogRouter);




export default app;

/*
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTMzYjhmMWUtMjczMi00NWZmLWE0YmQtYTBmMTNiMWI3ZTNlIiwidGVuYW50X2lkIjoiM2E1OGQ5YjA4M2JiNTc4YmViMDNhMGYzYTYwM2U4NWJlZDhjNjgyMGYzZmFjOGE0ZWFkY2ZhYWQ5Y2MxZDlkZiIsImludGVybmFsX3NlY3JldCI6IjQyMzE5Mjc1LTcxMDEtNDZhNi05ODdlLWMwYWIyMjI1NDlkMCJ9.iX706IhuuolwAnH3ifa373Qzk_KcF-33yEU977p-ZQk"
PULSE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTMzYjhmMWUtMjczMi00NWZmLWE0YmQtYTBmMTNiMWI3ZTNlIiwidGVuYW50X2lkIjoiM2E1OGQ5YjA4M2JiNTc4YmViMDNhMGYzYTYwM2U4NWJlZDhjNjgyMGYzZmFjOGE0ZWFkY2ZhYWQ5Y2MxZDlkZiIsImludGVybmFsX3NlY3JldCI6IjQyMzE5Mjc1LTcxMDEtNDZhNi05ODdlLWMwYWIyMjI1NDlkMCJ9.iX706IhuuolwAnH3ifa373Qzk_KcF-33yEU977p-ZQk"

*/
//