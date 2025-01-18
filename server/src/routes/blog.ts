import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createBlogInput,
  updateBlogInput,
} from "@lokeshsharma_19/medium-common_v2";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", authMiddleware);

blogRouter
  .post("/", async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorId = c.get("userId");

    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Inputs are not correct" });
    }

    const newBlog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({
      message: "Blog created successfully",
      id: newBlog.id,
    });
  })
  .put(async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Inputs are not correct" });
    }

    const updatedBlog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      message: "Blog updated successfully",
      id: updatedBlog.id,
    });
  });

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const allBlogs = await prisma.post.findMany({});
  return c.json({
    message: "All blogs",
    allBlogs: allBlogs,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const foundBlog = await prisma.post.findFirst({
    where: {
      id: id,
    },
  });

  return c.json({
    message: "found blog",
    blog: foundBlog,
  });
});
