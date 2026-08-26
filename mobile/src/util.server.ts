import { UUID } from "./types.server";
import { v4 as uuidv4 } from "uuid";

export const makeUUID = (): UUID => uuidv4();

export const makeErrorResponse = (error: string, data: any = null) => ({
  error,
  data,
});

export const makeSuccessResponse = (data: any) => ({ data });

export const uuidSet = (list: (UUID | { uuid: UUID })[]) => {
  const uuids = new Set<UUID>();
  for (const item of list) {
    const uuid = typeof item === "object" ? item.uuid : item;
    if (uuids.has(uuid)) return null;
    uuids.add(uuid);
  }
  return uuids;
};

export const isUUIDSet = (list: (UUID | { uuid: UUID })[]) => !!uuidSet(list);
