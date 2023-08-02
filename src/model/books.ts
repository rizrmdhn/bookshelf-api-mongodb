import { Schema, model } from "mongoose";
import { IBook } from "../types/books.js";

const bookSchema = new Schema<IBook>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  readPage: {
    type: Number,
    required: true,
  },
  reading: {
    type: Boolean,
    required: true,
  },
  finished: {
    type: Boolean,
  },
  insertedAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});

const Books = model<IBook>("Book", bookSchema);

export default Books;
