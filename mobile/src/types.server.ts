export type ServerResponse = { error?: any; data: any };

export const isServerResponse = (obj: any): obj is ServerResponse => {
  return typeof obj === "object" && obj !== null && "data" in obj;
};

export const isArray = <T>(
  obj: any,
  is: (obj: any) => obj is T,
): obj is T[] => {
  return Array.isArray(obj) && obj.every((o) => is(o));
};

export const isString = (obj: any): obj is string => {
  return typeof obj === "string";
};

export const isNumber = (obj: any): obj is number => {
  return typeof obj === "number";
};

export const isNullOr = <T>(
  obj: any,
  is: (obj: any) => obj is T,
): obj is null | T => {
  return obj === null || is(obj);
};

export const isOptional = <T>(
  obj: any,
  is: (obj: any) => obj is T,
): obj is undefined | T => {
  return obj === undefined || is(obj);
};

export type UUID = string;

export const isUUID = (obj: any): obj is UUID => {
  return isString(obj);
};
