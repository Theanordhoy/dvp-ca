import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const registerSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

const loginSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z.string(),
});

export function validateRegisterData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid registration data",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid login data",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
}
