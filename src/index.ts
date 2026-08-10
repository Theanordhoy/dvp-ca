import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articleRoutes from "./routes/articles";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express(); // This creates our Express application
const PORT = process.env.PORT || 3000; // This is the port our server will listen on

app.use(express.json());
app.use(cors());

app.use("/articles", articleRoutes);
app.use("/auth", authRoutes);

// This starts the server and listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
