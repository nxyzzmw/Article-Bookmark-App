import express from "express";
import bookmarkRouter from "./routes/bookmark.route.js";
import errorHandler from "../src/middleware/errorHandler.js";
import cors from "cors"
const app = express();
app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);
app.use(express.json()); //  REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use("/api/bookmark", bookmarkRouter);
app.use(errorHandler);

export default app;
