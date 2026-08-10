import { Router } from "express";
import { pool } from "../database";
import { Article } from "../interfaces";
import { ResultSetHeader } from "mysql2";
import { requiredArticleData } from "../middleware/article-validation";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        articles.id, 
        articles.title, 
        articles.body, 
        articles.category, 
        articles.submitted_by, 
        articles.created_at, 
        users.email 
        FROM articles 
        INNER JOIN users ON articles.submitted_by = users.id 
        ORDER BY articles.created_at DESC
        `);
    const articles = rows as Article[];
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.post("/", requiredArticleData, async (req, res) => {
  try {
    const { title, body, category, submitted_by } = req.body;

    const [result]: [ResultSetHeader, any] = await pool.execute(
      "INSERT INTO articles (title, body, category, submitted_by) VALUES (?, ?, ?, ?)",
      [title, body, category, submitted_by]
    );

    const article: Article = {
      id: result.insertId,
      title,
      body,
      category,
      submitted_by,
      created_at: new Date().toISOString(),
    };
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

export default router;
