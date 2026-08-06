import { isUUID, UUID } from "../../types.js";

export type Book = {
  name: string;
  authors: string[];
  uuid: UUID;
};

export const isBook = (obj: any): obj is Book => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.name === "string" &&
    Array.isArray(obj.authors) &&
    obj.authors.every((author: any) => typeof author === "string") &&
    isUUID(obj.uuid)
  );
};

export type Library = Book[];

export const isLibrary = (obj: any): obj is Library => {
  return Array.isArray(obj) && obj.every((book: any) => isBook(book));
};
