import * as bookmarkService from "../services/bookmark.service.js";

export const addBookmark = async (req, res, next) => {
  try {
    const bookmark = await bookmarkService.addBookmark(req.body);
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
    const updatedBookmark = await bookmarkService.updateBookmark(id, req.body);
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
