import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
  const header =
    c.req.header("Authorization") || c.req.header("authorization") || "";
  // Bearer token
  try {
    const token = header.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (user.id) {
      c.set("userId", user.id);
      await next();
      return;
    } else {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    c.status(403);
    return c.json({ message: "You are not logged in" });
  }
};
