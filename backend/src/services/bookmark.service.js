import Bookmark from "../models/bookmark.js";

export const addBookmark = async (data) => {
  const { title, url, category, description, status } = data;

  return await Bookmark.create({
    title,
    url,
    category,
    description,
    status, // optional (default = "unread")
  });
};

export const getAllBookmark = async (filters = {}) => {
  return await Bookmark.find(filters);
};

export const getBookMarkById = async (id) => {
  return await Bookmark.findById(id);
};

export const updateBookmark = async (id, data) => {
  return await Bookmark.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true, // IMPORTANT
  });
};

export const deleteBookmark = async (id) => {
  return await Bookmark.findByIdAndDelete(id);
};
