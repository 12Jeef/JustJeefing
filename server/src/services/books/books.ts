import express from "express";
import { setupStorage } from "../../storage.js";
import { Book, isAuthors, isLibrary, isTitle, Library } from "./types.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
  makeUUID,
} from "../../util.js";
import fs from "fs";
import logger from "../../logger.js";
import Busboy, { FileInfo } from "busboy";
import { Readable } from "stream";
import { UUID } from "../../types.js";

const l = logger.child("SERVICE:books");

function books() {
  const s = setupStorage(books);

  l.i(`Loading library...`);
  const library: Library = (() => {
    try {
      const data = s.readJSON("library.json");
      if (!isLibrary(data)) {
        l.e(`Loading library failed: Invalid library data`);
        return [];
      }
      return data;
    } catch (err) {
      l.e(`Loading library failed: ${err}`);
      return [];
    }
  })();
  l.s(`Loaded library: ${library.length} books`);
  s.writeJSON(library, "library.json");

  l.i(`Setting up API...`);
  const api = express.Router();

  // adding a book is not implemented yet, so just return a success response for now
  api.post("/add", (req, res) => {
    l.i("Adding book...");

    let title: string | null = null;
    let authors: string[] | null = null;
    let uuid: UUID | null = null;

    // validate and stream
    l.i("  Finding fields...");
    const bb = Busboy({ headers: req.headers });
    bb.on("field", (name: string, val: string) => {
      if (name === "title") {
        if (title !== null) {
          l.e(`  Finding fields failed: Duplicate title field`);
          res.status(400).json(makeErrorResponse("Duplicate title field"));
          return;
        }
        title = val;
        if (!isTitle(title)) {
          l.e(`  Finding fields failed: Invalid title "${title}"`);
          res.status(400).json(makeErrorResponse(`Invalid title "${title}"`));
          return;
        }
        l.i(`  ↪ Found title: ${title}`);
        return;
      }
      if (name === "authors") {
        if (authors !== null) {
          l.e(`  Finding fields failed: Duplicate authors field`);
          res.status(400).json(makeErrorResponse("Duplicate authors field"));
          return;
        }
        try {
          authors = JSON.parse(val);
        } catch (err) {
          l.e(`  Finding fields failed: Invalid authors "${val}"`);
          res.status(400).json(makeErrorResponse(`Invalid authors "${val}"`));
          return;
        }
        if (!isAuthors(authors)) {
          l.e(`  Finding fields failed: Invalid authors "${authors}"`);
          res
            .status(400)
            .json(makeErrorResponse(`Invalid authors "${authors}"`));
          return;
        }
        l.i(`  ↪ Found authors: ${authors.join(", ")}`);
        return;
      }
      l.e(`  Finding fields failed: Unexpected field name "${name}"`);
    });
    bb.on(
      "file",
      (
        name: string,
        stream: Readable & { truncated?: boolean },
        info: FileInfo,
      ) => {
        if (name !== "file") {
          l.e(`  Finding fields failed: Unexpected field name "${name}"`);
          stream.resume();
          return;
        }
        if (uuid !== null) {
          l.e(`  Finding fields failed: Duplicate file field`);
          res.status(400).json(makeErrorResponse("Duplicate file field"));
          stream.resume();
          return;
        }
        uuid = makeUUID();
        l.i(`  ↪ Found file: ${info.filename} → ${uuid}.pdf`);
        const filePath = s.makePath(uuid + ".pdf");
        const writeStream = fs.createWriteStream(filePath);
        l.i(`    Piping file...`);
        stream.pipe(writeStream);
        writeStream.on("finish", () => l.s("    Piped file"));
        writeStream.on("error", (err) => {
          l.e(`    Piping file failed: ${err}`);
          res.status(500).json(makeErrorResponse(`Piping file failed: ${err}`));
        });
      },
    );
    bb.on("close", () => {
      if (title === null) {
        l.e(`  Finding fields failed: Missing title field`);
        res.status(400).json(makeErrorResponse("Missing title field"));
        return;
      }
      if (authors === null) {
        l.e(`  Finding fields failed: Missing authors field`);
        res.status(400).json(makeErrorResponse("Missing authors field"));
        return;
      }
      if (uuid === null) {
        l.e(`  Finding fields failed: Missing file field`);
        res.status(400).json(makeErrorResponse("Missing file field"));
        return;
      }
      const book: Book = { title, authors, uuid };
      library.push(book);
      s.writeJSON(library, "library.json");
      l.s(`Added book: "${title}" by ${authors.join(", ")}`);
      res.json(makeSuccessResponse(book));
    });
    req.pipe(bb);
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
      l.e(`Getting book ${req.params.uuid} failed: Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`));
      return;
    }
    l.s(`Got book: "${book.title}" by ${book.authors.join(", ")}`);
    res.json(makeSuccessResponse(book));
  });

  // get a book pdf by uuid
  api.get("/get/:uuid/pdf", (req, res) => {
    l.i(`Getting book pdf ${req.params.uuid}...`);
    const book = library.find((b) => b.uuid === req.params.uuid);
    if (!book) {
      l.e(`Getting book pdf ${req.params.uuid} failed: Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`));
      return;
    }
    l.s(`Got book pdf: "${book.title}" by ${book.authors.join(", ")}`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.uuid}.pdf"`,
    );
    const stream = fs.createReadStream(s.makePath(book.uuid + ".pdf"));
    stream.pipe(res);
    stream.on("error", (err) => {
      l.e(`Getting book pdf ${req.params.uuid} failed: ${err}`);
      res.status(500).json(makeErrorResponse(`Streaming pdf failed: ${err}`));
    });
  });

  // remove a book by uuid
  api.delete("/remove/:uuid", (req, res) => {
    l.i(`Removing book ${req.params.uuid}...`);
    const bookIndex = library.findIndex((b) => b.uuid === req.params.uuid);
    if (bookIndex === -1) {
      l.e(`Removing book ${req.params.uuid} failed: Book not found`);
      res
        .status(404)
        .json(makeErrorResponse(`Book not found ${req.params.uuid}`));
      return;
    }
    const book = library[bookIndex];
    l.s(`Removing book: "${book.title}" by ${book.authors.join(", ")}`);
    fs.unlinkSync(s.makePath(book.uuid + ".pdf"));
    library.splice(bookIndex, 1);
    s.writeJSON(library, "library.json");
    res.json(makeSuccessResponse(null));
  });

  l.s(`Set up API`);

  return api;
}
export default books;
