import { isArray, isString, isUUID, UUID } from "../../../types.server";
import { isUUIDSet } from "../../../util.server";

export type Book = {
  uuid: UUID;
  title: string;
  authors: string[];
};

export const isBook = (obj: any): obj is Book => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isUUID(obj.uuid) &&
    isString(obj.title) &&
    isArray(obj.authors, isString)
  );
};

export type Library = Book[];

export const isLibrary = (obj: any): obj is Library => {
  return isArray(obj, isBook) && isUUIDSet(obj);
};
