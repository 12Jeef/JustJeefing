import express from "express";
import logger from "../../logger.js";
import { setupStorage } from "../../storage.js";
import {
  OnlyDate,
  isItem,
  isItemBase,
  isItems,
  isItemUpdate,
  isList,
  isListBase,
  isLists,
  isListUpdate,
  Items,
  Lists,
} from "./types.js";
import { compareDates, intersects, updateItem, updateList } from "./util.js";
import { makeCRUD } from "../../service.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
  makeUUID,
} from "../../util.js";

const l = logger.child("SERVICE:todo");

export default function todo() {
  const s = setupStorage(todo);

  l.i(`Loading items...`);
  const items: Items = (() => {
    try {
      const data = s.readJSON("items.json");
      if (!isItems(data)) {
        l.e(`Loading items failed: Invalid items data`);
        return [];
      }
      return data;
    } catch (err) {
      l.e(`Loading items failed: ${err}`);
      return [];
    }
  })();
  if (!items.length)
    items.push(
      {
        uuid: makeUUID(),
        text: "Do thing 1",
        note: "",
        lists: [],
        added: [2026, 8, 23],
        closed: [2026, 8, 24],
      },
      {
        uuid: makeUUID(),
        text: "Do thing 2",
        note: "",
        lists: [],
        added: [2026, 8, 24],
        closed: [2026, 8, 25],
      },
      {
        uuid: makeUUID(),
        text: "Do thing 3",
        note: "",
        lists: [],
        added: [2026, 8, 25],
        closed: null,
      },
      {
        uuid: makeUUID(),
        text: "Do thing 4",
        note: "",
        lists: [],
        added: [2026, 8, 23],
        closed: null,
      },
    );
  l.s(`Loaded items: ${items.length} items`);
  s.writeJSON(items, "items.json");

  l.i(`Loading lists...`);
  const lists: Lists = (() => {
    try {
      const data = s.readJSON("lists.json");
      if (!isLists(data)) {
        l.e(`Loading lists failed: Invalid lists data`);
        return [];
      }
      return data;
    } catch (err) {
      l.e(`Loading lists failed: ${err}`);
      return [];
    }
  })();
  l.s(`Loaded lists: ${lists.length} lists`);
  s.writeJSON(lists, "lists.json");

  l.i(`Setting up API...`);
  const api = express.Router();

  makeCRUD(
    api,
    l,
    "item",
    "items",
    isItem,
    isItemBase,
    isItemUpdate,
    (item) => JSON.stringify(item.text),
    items,
    updateItem,
    () => s.writeJSON(items, "items.json"),
  );

  makeCRUD(
    api,
    l,
    "list",
    "lists",
    isList,
    isListBase,
    isListUpdate,
    (list) => JSON.stringify(list.name),
    lists,
    updateList,
    () => s.writeJSON(lists, "lists.json"),
  );

  // get items by date
  api.get(
    "/items/get/:yStart/:mStart/:dStart/:yEnd/:mEnd/:dEnd",
    (req, res) => {
      l.i(`Getting items by date...`);
      const start = checkDate(
        req.params.yStart,
        req.params.mStart,
        req.params.dStart,
      );
      if (typeof start === "string") {
        l.e(`Getting items by date failed: Invalid start date ${start}`);
        res.status(400).json(makeErrorResponse(`Invalid start date ${start}`));
        return;
      }
      const end = checkDate(req.params.yEnd, req.params.mEnd, req.params.dEnd);
      if (typeof end === "string") {
        l.e(`Getting items by date failed: Invalid end date ${end}`);
        res.status(400).json(makeErrorResponse(`Invalid end date ${end}`));
        return;
      }
      l.i(`↪ From ${start} to ${end}`);
      if (compareDates(start, end) > 0) {
        l.e(
          `Getting items by date failed: Start date after end date ${start} -> ${end}`,
        );
        res
          .status(400)
          .json(
            makeErrorResponse(`Start date after end date ${start} -> ${end}`),
          );
        return;
      }
      const filteredItems = items.filter((item) =>
        intersects(item, start, end),
      );
      l.s(`Got items by date: n=${filteredItems.length}`);
      res.json(makeSuccessResponse(filteredItems));
    },
  );

  l.s(`Set up API`);
  return api;
}

const checkDate = (
  yStr: string,
  mStr: string,
  dStr: string,
): OnlyDate | string => {
  const y = parseInt(yStr);
  const m = parseInt(mStr);
  const d = parseInt(dStr);
  if (y < 0) return `Year < 0`;
  if (m < 1) return `Month < 1`;
  if (m > 12) return `Month < 12`;
  if (d < 1) return `Day < 1`;
  if (d > 31) return `Day > 31`;
  return [y, m, d];
};
