import { Router } from "express";
import * as bookmarkController from "../contollers/bookmark.controller.js";
import validate from "../middleware/validate.js";
import {
  addBookmarkValidator,
  updateBookmarkValidator
} from "../validators/bookmark.validator.js";

const router = Router();

router.get(
  "/",
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
  bookmarkController.deleteBookmark
);

export default router;
