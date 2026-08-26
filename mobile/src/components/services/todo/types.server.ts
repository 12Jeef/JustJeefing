import {
  isArray,
  isNullOr,
  isNumber,
  isOptional,
  isString,
  isUUID,
  UUID,
} from "../../../types.server";
import { isUUIDSet } from "../../../util.server";

export type Color = "R" | "O" | "Y" | "G" | "B" | "P" | "M";

export const isColor = (obj: any): obj is Color => {
  return isString(obj) && ["R", "O", "Y", "G", "B", "P", "M"].includes(obj);
};

export type OnlyDate = [number, number, number]; // Y M D

export const isOnlyDate = (obj: any): obj is OnlyDate => {
  return isArray(obj, isNumber) && obj.length === 3;
};

export type ItemBase = {
  text: string;
  note: string;
  lists: UUID[];
  added: OnlyDate;
  closed: OnlyDate | null;
};

export const isItemBase = (obj: any): obj is ItemBase => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isString(obj.text) &&
    isString(obj.note) &&
    isArray(obj.lists, isUUID) &&
    isOnlyDate(obj.added) &&
    isNullOr(obj.closed, isOnlyDate)
  );
};

export type Item = ItemBase & { uuid: UUID };

export const isItem = (obj: any): obj is Item => {
  return isItemBase(obj) && isUUID((obj as any).uuid);
};

export type ItemUpdate = {
  text?: string;
  note?: string;
  addLists?: UUID[];
  removeLists?: UUID[];
  added?: OnlyDate;
  closed?: OnlyDate | null;
};

export const isItemUpdate = (obj: any): obj is ItemUpdate => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isOptional(obj.text, isString) &&
    isOptional(obj.note, isString) &&
    isOptional(obj.addLists, (o) => isArray(o, isUUID)) &&
    isOptional(obj.removeLists, (o) => isArray(o, isUUID)) &&
    isOptional(obj.added, isOnlyDate) &&
    isOptional(obj.closed, (o) => isNullOr(o, isOnlyDate))
  );
};

export type Items = Item[];

export const isItems = (obj: any): obj is Items => {
  return isArray(obj, isItem) && isUUIDSet(obj);
};

export type ListBase = {
  uuid: UUID;
  name: string;
  color: Color;
};

export const isListBase = (obj: any): obj is ListBase => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isString(obj.name) &&
    isColor(obj.color)
  );
};

export type List = ListBase & { uuid: UUID };

export const isList = (obj: any): obj is List => {
  return isListBase(obj) && isUUID((obj as any).uuid);
};

export type ListUpdate = {
  name?: string;
  color?: Color;
};

export const isListUpdate = (obj: any): obj is ListUpdate => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    isOptional(obj.name, isString) &&
    isOptional(obj.color, isColor)
  );
};

export type Lists = List[];

export const isLists = (obj: any): obj is Lists => {
  return isArray(obj, isList) && isUUIDSet(obj);
};
