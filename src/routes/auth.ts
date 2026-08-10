import "dotenv/config";
import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import {
  validateRegisterData,
  validateLogin,
} from "../middleware/auth-validation";
import { User, UserResponse } from "../interfaces";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post("/register", validateRegisterData, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute("select * from users where email = ?", [
      email,
    ]);

    const existingUser = rows as User[];

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into users (email, password) values (?, ?)",
      [email, hashedPassword]
    );

    const userResponse: UserResponse = {
      id: result.insertId,
      email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute("select * from users where email = ?", [
      email,
    ]);

    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password!);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
    };

    res.json({
      message: "User logged in successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to log in user" });
  }
});

export default router;
