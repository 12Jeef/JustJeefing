import express from "express";
import { Logger } from "./logger.js";
import { makeErrorResponse, makeSuccessResponse, makeUUID } from "./util.js";
import { UUID } from "./types.js";

export const makeCRUD = <TBase, TUpdate>(
  api: express.Router,
  l: Logger,
  singular: string,
  plural: string,
  isT: (obj: any) => obj is TBase & { uuid: UUID },
  isTBase: (obj: any) => obj is TBase,
  isTUpdate: (obj: any) => obj is TUpdate,
  repr: (item: TBase & { uuid: UUID }) => string,
  items: (TBase & { uuid: UUID })[],
  update: (item: TBase & { uuid: UUID }, update: TUpdate) => void,
  save: () => void,
) => {
  // create an item
  api.post(`/${singular}/create`, (req, res) => {
    l.i(`Creating ${singular}...`);
    const itemBase = req.body.item;
    if (!isTBase(itemBase)) {
      l.e(
        `Creating ${singular} failed: Invalid item base ${JSON.stringify(itemBase)}`,
      );
      res
        .status(400)
        .json(
          makeErrorResponse(`Invalid item base ${JSON.stringify(itemBase)}`),
        );
      return;
    }
    const uuid = makeUUID();
    const item: TBase & { uuid: UUID } = { ...itemBase, uuid };
    items.push(item);
    save();
    l.s(`Created ${singular}: ${uuid} ${repr(item)}`);
    res.json(makeSuccessResponse(item));
  });

  // update an item
  api.post(`/${singular}/update/:uuid`, (req, res) => {
    const uuid = req.params.uuid;
    l.i(`Updating ${singular} ${uuid}...`);
    const item = items.find((item) => item.uuid === uuid);
    if (!item) {
      l.e(`Updating ${singular} ${uuid} failed: Item not found ${uuid}`);
      res.status(404).json(makeErrorResponse(`Item not found ${uuid}`));
      return;
    }
    const itemUpdate = req.body.item;
    if (!isTUpdate(itemUpdate)) {
      l.e(
        `Updating ${singular} ${uuid} failed: Invalid item update ${JSON.stringify(itemUpdate)}`,
      );
      res
        .status(400)
        .json(
          makeErrorResponse(
            `Invalid item update ${JSON.stringify(itemUpdate)}`,
          ),
        );
      return;
    }
    update(item, itemUpdate);
    save();
    l.s(`Updated ${singular} ${uuid}: ${repr(item)}`);
    res.json(makeSuccessResponse(item));
  });

  // delete an item
  api.delete(`/${singular}/delete/:uuid`, (req, res) => {
    const uuid = req.params.uuid;
    l.i(`Deleting ${singular} ${uuid}...`);
    const itemIndex = items.findIndex((item) => item.uuid === uuid);
    if (itemIndex < 0) {
      l.e(`Deleting ${singular} ${uuid} failed: Item not found ${uuid}`);
      res.status(404).json(makeErrorResponse(`Item not found ${uuid}`));
      return;
    }
    const item = items[itemIndex];
    items.splice(itemIndex, 1);
    save();
    l.s(`Deleted ${singular} ${uuid}: ${repr(item)}`);
    res.json(makeSuccessResponse(item));
  });

  // get all items
  api.get(`/${singular}/get`, (req, res) => {
    l.i(`Getting all ${plural}...`);
    l.s(`Got all ${plural}`);
    res.json(makeSuccessResponse(items));
  });

  // get an item
  api.get(`/${singular}/get/:uuid`, (req, res) => {
    const uuid = req.params.uuid;
    l.i(`Getting ${singular} ${uuid}...`);
    const item = items.find((item) => item.uuid === uuid);
    if (!item) {
      l.e(`Getting ${singular} failed: Item not found ${uuid}`);
      res.status(404).json(makeErrorResponse(`Item not found ${uuid}`));
      return;
    }
    l.s(`Got item ${uuid}: ${repr(item)}`);
    res.json(makeSuccessResponse(item));
  });
};
