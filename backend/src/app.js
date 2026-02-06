import express from "express";
import bookmarkRouter from "./routes/bookmark.route.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api/bookmark", bookmarkRouter);
app.use(errorHandler);

export default app;
