import { Hono } from "hono";

import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono();

// ######### routes ##########

app.route("/api/v1/user", userRouter);

app.route("/api/v1/blog", blogRouter);

// app.post("/api/v1/blog", (c) => {}).put((c) => {});

// app.get("/api/v1/blog/:id", (c) => {
//   const id = c.req.param("id");
// });

// app.get("/api/v1/blog/bulk", (c) => {});

export default app;
