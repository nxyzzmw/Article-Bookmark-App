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
    .isURL({ require_tld: false }).withMessage("Invalid URL"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isString().withMessage("Category must be String"),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be string")

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
    .isIn(["unread", "read"])
    .withMessage("Invalid status"),

  body("title")
    .optional()
    .isString(),

  body("url")
    .optional()
    .isURL(),

  body("category")
    .optional()
    
];
