import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
  });

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({
    message: "GitHub Shoppers API",
    status: "running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
