import fs from "fs";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";

export type LogLevel = "INFO" | "SUCCESS" | "WARN" | "ERROR" | "DEBUG";

const write = (
  stream: fs.WriteStream,
  level: LogLevel,
  indent: number,
  msg: string,
) => {
  const now = new Date();
  const timestamp = now.toISOString();
  const consoleMsg = `${
    {
      INFO: "",
      SUCCESS: GREEN,
      WARN: YELLOW,
      ERROR: RED,
      DEBUG: BLUE,
    }[level]
  }[${level[0]}] ${" ".repeat(indent)}${msg}${RESET}\n`;
  const streamMsg = `${timestamp} [${level[0]}] ${msg}\n`;
  process.stdout.write(consoleMsg);
  stream.write(streamMsg);
};

export type Logger = {
  i: (msg: string) => void;
  s: (msg: string) => void;
  w: (msg: string) => void;
  e: (msg: string) => void;
  d: (msg: string) => void;
  child: (tag: string) => Logger;
  indent: () => void;
  unindent: () => void;
};

export function childLogger(parent: Logger, tag: string): Logger {
  tag = tag.trim().padEnd(17, " ");
  return {
    i: (msg: string) => parent.i(`${tag}> ${msg}`),
    s: (msg: string) => parent.s(`${tag}> ${msg}`),
    w: (msg: string) => parent.w(`${tag}> ${msg}`),
    e: (msg: string) => parent.e(`${tag}> ${msg}`),
    d: (msg: string) => parent.d(`${tag}> ${msg}`),
    child: function (tag: string) {
      return childLogger(this, tag);
    },
    indent: parent.indent,
    unindent: parent.unindent,
  };
}

export function createLogger(logPath: string): Logger {
  if (fs.existsSync(logPath)) fs.unlinkSync(logPath);
  const stream = fs.createWriteStream(logPath, { flags: "a" });
  let indent = 0;
  return {
    i: (msg: string) => write(stream, "INFO", indent, msg),
    s: (msg: string) => write(stream, "SUCCESS", indent, msg),
    w: (msg: string) => write(stream, "WARN", indent, msg),
    e: (msg: string) => write(stream, "ERROR", indent, msg),
    d: (msg: string) => write(stream, "DEBUG", indent, msg),
    child: function (tag: string) {
      return childLogger(this, tag);
    },
    indent: () => indent++,
    unindent: () => indent--,
  };
}

const logger = createLogger("session.log");
export default logger;
