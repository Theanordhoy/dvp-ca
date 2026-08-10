import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const requiredArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long")
    .trim(),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters long")
    .max(1000, "Body must be at most 1000 characters long")
    .trim(),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters long")
    .max(50, "Category must be at most 50 characters long")
    .trim(),
});

export function requiredArticleData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = requiredArticleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid article data",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
}
