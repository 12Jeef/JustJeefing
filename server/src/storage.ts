import express from "express";
import fs from "fs";
import path from "path";
import { DATA_DIR } from "./config.js";

export type Storage = {
  dir: string;
  makePath: (...subPath: string[]) => string;
  makeDir: (...subPath: string[]) => void;
  readFile: (...subPath: string[]) => string;
  writeFile: (data: string, ...subPath: string[]) => void;
  readJSON: (...subPath: string[]) => any;
  writeJSON: (data: any, ...subPath: string[]) => void;
};

export const setupStorage = (service: () => express.Router): Storage => {
  const dir = path.join(DATA_DIR, service.name);
  fs.mkdirSync(dir, { recursive: true });
  const makePath = (...subPath: string[]) => path.join(dir, ...subPath);
  const makeDir = (...subPath: string[]) =>
    fs.mkdirSync(makePath(...subPath), { recursive: true });
  const readFile = (...subPath: string[]) =>
    fs.readFileSync(makePath(...subPath), "utf-8");
  const writeFile = (data: string, ...subPath: string[]) =>
    fs.writeFileSync(makePath(...subPath), data);
  const readJSON = (...subPath: string[]) => JSON.parse(readFile(...subPath));
  const writeJSON = (data: any, ...subPath: string[]) =>
    writeFile(JSON.stringify(data, null, 2), ...subPath);
  return { dir, makePath, makeDir, readFile, writeFile, readJSON, writeJSON };
};
