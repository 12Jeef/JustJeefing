import express from "express";
import { setupStorage } from "../../storage.js";
import { isLibrary, Library } from "./types.js";
import { makeErrorResponse, makeSuccessResponse } from "../../util.js";
import fs from "fs";
import logger from "../../logger.js";

const l = logger.child("SERVICE|books");

function books() {
  const s = setupStorage(books);

  // load library
  const library: Library = (() => {
    try {
      const data = s.readJSON("library.json");
      if (!isLibrary(data)) return [];
      return data;
    } catch (err) {
      return [];
    }
  })();
  s.writeJSON(library, "library.json");

  // set up API
  const api = express.Router();

  // adding a book is not implemented yet, so just return a success response for now
  api.post("/add", (req, res) => {
    // TODO
    l.i("Adding book...");
    res.json(makeSuccessResponse(null));
  });

  // get all books
  api.get("/get", (req, res) => {
    l.i("Getting library...");
    res.json(makeSuccessResponse(library));
  });

  // get a book by uuid
  api.get("/get/:uuid", (req, res) => {
    l.i(`Getting book ${req.params.uuid}...`);
    const book = library.find((b) => b.uuid === req.params.uuid);
    if (!book) {
      l.w(`↪ Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`, null));
      return;
    }
    l.s(`↪ Book found: "${book.name}" by ${book.authors.join(", ")}`);
    res.json(makeSuccessResponse(book));
  });

  // get a book pdf by uuid
  api.get("/get/:uuid/pdf", (req, res) => {
    l.i(`Getting book pdf ${req.params.uuid}...`);
    const book = library.find((b) => b.uuid === req.params.uuid);
    if (!book) {
      l.w(`↪ Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`, null));
      return;
    }
    // TODO
    l.s(`↪ Book found: "${book.name}" by ${book.authors.join(", ")}`);
    res.json(makeSuccessResponse(null));
  });

  // remove a book by uuid
  api.delete("/remove/:uuid", (req, res) => {
    l.i(`Removing book ${req.params.uuid}...`);
    const bookIndex = library.findIndex((b) => b.uuid === req.params.uuid);
    if (bookIndex === -1) {
      l.w(`↪ Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`, null));
      return;
    }
    l.s(
      `↪ Book found: "${library[bookIndex].name}" by ${library[bookIndex].authors.join(", ")}`,
    );
    const book = library[bookIndex];
    fs.unlinkSync(s.makePath(book.uuid + ".pdf"));
    library.splice(bookIndex, 1);
    s.writeJSON(library, "library.json");
    res.json(makeSuccessResponse(null));
  });

  return api;
}
export default books;
