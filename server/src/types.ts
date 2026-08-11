export type UUID = string;

export const isUUID = (obj: any): obj is UUID => {
  return typeof obj === "string";
};
