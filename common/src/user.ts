import z from "zod";

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpInput>;

export const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInInput = z.infer<typeof signInInput>;
