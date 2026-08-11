import { isUUID, UUID } from "../../types.js";

export type Book = {
  title: string;
  authors: string[];
  uuid: UUID;
};

export const isTitle = (obj: any): obj is string => {
  return typeof obj === "string";
};

export const isAuthors = (obj: any): obj is string[] => {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    obj.every((a) => typeof a === "string")
  );
};

export const isBook = (obj: any): obj is Book => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isTitle(obj.title) &&
    isAuthors(obj.authors) &&
    isUUID(obj.uuid)
  );
};

export type Library = Book[];

export const isLibrary = (obj: any): obj is Library => {
  return Array.isArray(obj) && obj.every((book: any) => isBook(book));
};
