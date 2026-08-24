#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const projectRoot = path.dirname(import.meta.dirname);
const repoRoot = path.dirname(projectRoot);
