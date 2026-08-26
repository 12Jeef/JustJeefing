import { OnlyDate, Item, ItemUpdate, List, ListUpdate } from "./types.server";

export const compareDates = (a: OnlyDate | null, b: OnlyDate | null) => {
  if (a === null) {
    if (b === null) return 0;
    return +1;
  }
  if (b === null) return -1;
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return +1;
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return +1;
  if (a[2] < b[2]) return -1;
  if (a[2] > b[2]) return +1;
  return 0;
};

export const updateItem = (item: Item, update: ItemUpdate): Item => {
  if (update.text !== undefined) item.text = update.text;
  if (update.note !== undefined) item.note = update.note;
  if (update.addLists !== undefined)
    for (const uuid of update.addLists)
      if (!item.lists.includes(uuid)) item.lists.push(uuid);
  if (update.removeLists !== undefined)
    for (const uuid of update.removeLists)
      if (item.lists.includes(uuid))
        item.lists.splice(item.lists.indexOf(uuid), 1);
  if (update.added !== undefined) item.added = update.added;
  if (update.closed !== undefined) item.closed = update.closed;
  return item;
};

export const updateList = (list: List, update: ListUpdate): List => {
  if (update.name !== undefined) list.name = update.name;
  if (update.color !== undefined) list.color = update.color;
  return list;
};

export const intersects = (
  item: Item,
  start: OnlyDate,
  possibleEnd?: OnlyDate,
): boolean => {
  const end = possibleEnd ?? start;
  if (compareDates(item.closed, start) < 0) return false;
  if (compareDates(item.added, end) > 0) return false;
  return true;
};
