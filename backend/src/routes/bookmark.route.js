import { Router } from "express";
import * as bookmarkController from "../controllers/bookmark.controller.js";
import validate from "../middlewares/validate.js";
import {
  addBookmarkValidator,
  updateBookmarkValidator,
  deleteBookmarkValidator,
  getBookmarksValidator
} from "../validators/bookmark.validator.js";

const router = Router();

router.get(
  "/",
  getBookmarksValidator,
  validate,
  bookmarkController.getAllBookmark
);

router.post(
  "/",
  addBookmarkValidator,
  validate,
  bookmarkController.addBookmark
);

router.put(
  "/:id",
  updateBookmarkValidator,
  validate,
  bookmarkController.updateBookmark
);

router.delete(
  "/:id",
  deleteBookmarkValidator,
  validate,
  bookmarkController.deleteBookmark
);

export default router;
