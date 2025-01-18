import z from "zod";

export const createBlogInput = z.object({
  title: z.string().min(6),
  content: z.string().min(30),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  id: z.string(),
  title: z.string().min(6),
  content: z.string().min(30),
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
