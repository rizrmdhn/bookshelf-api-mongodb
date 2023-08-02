import { Request, ResponseToolkit } from "@hapi/hapi";
import { nanoid } from "nanoid";
import Books from "../../model/books.js";
import { IBook } from "../../types/books.js";

const addBookHandler = async (request: Request, h: ResponseToolkit) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload as IBook;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = `book-${nanoid(16)}`;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = new Books({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  });

  await newBooks.save();

  const isSuccess = await Books.findOne({ id: id });

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = async (request: Request, h: ResponseToolkit) => {
  const { name, reading, finished } = request.query as IBook;
  const books = await Books.find();

  if (books.length > 0) {
    if (name !== undefined) {
      const books = await Books.find({ name: name });

      if (books.length > 0) {
        const response = h.response({
          status: "success",
          data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }

    if (reading !== undefined) {
      const books = await Books.find({ reading: !!Number(reading) });

      if (books.length > 0) {
        const response = h.response({
          status: "success",
          data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }

    if (finished !== undefined) {
      const books = await Books.find({ finished: !!Number(finished) });

      if (books.length > 0) {
        const response = h.response({
          status: "success",
          data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }

    const books = await Books.find();

    const response = h.response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params as IBook;

  const books = await Books.findOne({ id: id });

  if (books) {
    const response = h.response({
      status: "success",
      data: {
        book: books,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params as IBook;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload as IBook;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const books = await Books.findOne({ id: id });

  if (books) {
    const finished = pageCount === readPage;

    const updateBooks = await Books.updateOne(
      { id: id },
      {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      }
    );

    if (updateBooks) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params as IBook;

  const books = await Books.findOne({ id: id });

  if (books) {
    const deleteBooks = await Books.deleteOne({ id: id });

    if (deleteBooks) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
