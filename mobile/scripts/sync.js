#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const mobileRoot = path.dirname(import.meta.dirname);
const repoRoot = path.dirname(mobileRoot);
const serverRoot = path.join(repoRoot, "server");

const fixContent = (content) =>
  content
    .replaceAll("types.js", "types.server")
    .replaceAll("util.js", "util.server");

fs.writeFileSync(
  path.join(mobileRoot, "src", "types.server.ts"),
  fixContent(
    fs.readFileSync(path.join(serverRoot, "src", "types.ts"), "utf-8"),
  ),
);
fs.writeFileSync(
  path.join(mobileRoot, "src", "util.server.ts"),
  fixContent(fs.readFileSync(path.join(serverRoot, "src", "util.ts"), "utf-8")),
);

const services = fs.readdirSync(path.join(serverRoot, "src", "services"));

const fixServiceContent = (content) =>
  fixContent(
    content
      .replaceAll("../../types.js", "../../../types.js")
      .replaceAll("../../util.js", "../../../util.js"),
  );

for (const service of services) {
  const mobileServiceRoot = path.join(
    mobileRoot,
    "src",
    "components",
    "services",
    service,
  );
  const serverServiceRoot = path.join(serverRoot, "src", "services", service);
  fs.mkdirSync(mobileServiceRoot, {
    recursive: true,
  });
  const content = fs.readFileSync(
    path.join(serverServiceRoot, "types.ts"),
    "utf-8",
  );
  const newContent = fixServiceContent(content);
  fs.writeFileSync(path.join(mobileServiceRoot, "types.server.ts"), newContent);
  if (fs.existsSync(path.join(serverServiceRoot, "util.ts"))) {
    const content = fs.readFileSync(
      path.join(serverServiceRoot, "util.ts"),
      "utf-8",
    );
    const newContent = fixServiceContent(content);
    fs.writeFileSync(
      path.join(mobileServiceRoot, "util.server.ts"),
      newContent,
    );
  }
}
