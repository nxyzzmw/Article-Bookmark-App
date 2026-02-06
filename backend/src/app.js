import express from "express";
import bookmarkRouter from "./routes/bookmark.route.js";
import errorHandler from "../src/middleware/errorHandler.js";

const app = express();

app.use(express.json()); // 🔴 REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use("/api/bookmark", bookmarkRouter);
app.use(errorHandler);

export default app;
