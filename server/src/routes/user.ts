import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, decode } from "hono/jwt";
import { signInInput, signUpInput } from "@lokeshsharma_19/medium-common_v2";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signUpInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are not correct" });
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
      name: body.name || "",
    },
  });

  const token = await sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    c.env.JWT_SECRET
  );
  if (!user) {
    c.status(403);
    return c.json({ message: "Sign up failed" });
  }

  return c.json({
    message: "Sign up successfully done",
    token: token,
  });
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signInInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are not correct" });
  }

  console.log(body.email, "!!!!");
  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user) {
    c.status(403);
    return c.json({ message: "User not found" });
  }

  const token = await sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    c.env.JWT_SECRET
  );

  return c.json({ message: "Sign in Successful", token: token, user: user });
});
