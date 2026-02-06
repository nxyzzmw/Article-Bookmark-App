import * as bookmarkService from "../services/bookmark.service.js";
import { matchedData } from "express-validator";

export const addBookmark = async (req, res, next) => {
  try {
    const data = matchedData(req)
    console.log(data)
    const bookmark = await bookmarkService.addBookmark(data);
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
};

export const getAllBookmark = async (req, res, next) => {
  try {
    const { status, type } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    const bookmarks = await bookmarkService.getAllBookmark(filters);
    res.status(200).json(bookmarks);
  } catch (err) {
    next(err);
  }
};

export const updateBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = matchedData(req)
    console.log(data)
    const updatedBookmark = await bookmarkService.updateBookmark(id, data);
    res.status(200).json(updatedBookmark);
  } catch (err) {
    next(err);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    await bookmarkService.deleteBookmark(id);
    res.status(200).json({ msg: "Bookmark deleted" });
  } catch (err) {
    next(err);
  }
};
