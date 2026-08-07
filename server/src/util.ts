import { UUID } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export const makeUUID = (): UUID => uuidv4();

export const makeErrorResponse = (error: string, data: any = null) => ({
  error,
  data,
});

export const makeSuccessResponse = (data: any) => ({ data });
