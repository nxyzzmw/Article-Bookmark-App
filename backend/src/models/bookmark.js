import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["article", "video", "podcast"],
      default: "article"
    },
    status: {
      type: String,
      enum: ["unread", "read", "listened"],
      default: "unread"
    }
  },
  { timestamps: true }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;