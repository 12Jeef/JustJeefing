import { OnlyDate, Item } from "./types.server";

export type Day = {
  date: OnlyDate;
  items: Item[];
  loaded: boolean;
};
