#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const projectRoot = path.dirname(import.meta.dirname);
const repoRoot = path.dirname(projectRoot);

const envContent = fs.readFileSync(path.join(repoRoot, ".env"), "utf-8");
const lines = envContent.split("\n");
const newLines = lines.map((line) =>
  line.includes("=") ? "EXPO_PUBLIC_" + line : line,
);
const lanIP = execSync("ipconfig getifaddr en0", { encoding: "utf-8" }).trim();
newLines.push(`EXPO_PUBLIC_DEV_SERVER_IP=${lanIP}`);
const newEnvContent = newLines.join("\n");
fs.writeFileSync(path.join(projectRoot, ".env"), newEnvContent);
