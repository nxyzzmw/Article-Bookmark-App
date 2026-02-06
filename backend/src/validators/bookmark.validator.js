import { body, param, query } from "express-validator";
import mongoose from "mongoose";

/* ---------- Add Bookmark ---------- */
export const addBookmarkValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim(),

  body("url")
    .notEmpty().withMessage("URL is required")
    .isURL().withMessage("Invalid URL"),

  body("type")
    .optional()
    .isIn(["article", "video", "podcast"])
    .withMessage("Type must be article, video, or podcast")
];

/* ---------- Update Bookmark ---------- */
export const updateBookmarkValidator = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid bookmark ID"),

  body()
    .notEmpty()
    .withMessage("Update data cannot be empty"),

  body("status")
    .optional()
    .isIn(["unread", "read", "listened"])
    .withMessage("Invalid status"),

  body("title")
    .optional()
    .isString(),

  body("url")
    .optional()
    .isURL(),

  body("type")
    .optional()
    .isIn(["article", "video", "podcast"])
];

/* ---------- Delete Bookmark ---------- */
export const deleteBookmarkValidator = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid bookmark ID")
];

/* ---------- Get Bookmarks (Filters) ---------- */
export const getBookmarksValidator = [
  query("status")
    .optional()
    .isIn(["unread", "read", "listened"])
    .withMessage("Invalid status filter"),

  query("type")
    .optional()
    .isIn(["article", "video", "podcast"])
    .withMessage("Invalid type filter")
];
