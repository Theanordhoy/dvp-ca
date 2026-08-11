import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

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

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token must be in format: Bearer <token>" });
  }

  const token = authHeader.substring(7);

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  req.user = { id: payload.userId };

  next();
}
