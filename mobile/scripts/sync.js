#!/usr/bin/env node

import path from "path";
import fs from "fs";

const projectRoot = path.dirname(import.meta.dirname);
const repoRoot = path.dirname(projectRoot);

const envContent = fs.readFileSync(path.join(repoRoot, ".env"), "utf-8");
const lines = envContent.split("\n");
const newLines = lines.map((line) =>
  line.includes("=") ? "EXPO_PUBLIC_" + line : line,
);
const newEnvContent = newLines.join("\n");
fs.writeFileSync(path.join(projectRoot, ".env"), newEnvContent);
