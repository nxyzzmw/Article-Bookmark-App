import Bookmark from "../models/bookmark.js";

export const addBookmark = async (data) => {
  const { title, url, type } = data;
  return await Bookmark.create({ title, url, type });
};

export const getAllBookmark = async (filters = {}) => {
  return await Bookmark.find(filters);
};

export const getBookMarkById = async (id) => {
  return await Bookmark.findById(id);
};

export const updateBookmark = async (id, data) => {
  return await Bookmark.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBookmark = async (id) => {
  return await Bookmark.findByIdAndDelete(id);
};
