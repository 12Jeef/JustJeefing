import express from "express";
import logger from "./logger.js";
import { SERVER_LOCAL_PORT, SERVER_LOCAL_IP } from "./config.js";
import books from "./services/books/books.js";
import { auth, setup } from "./auth.js";

const l = logger.child("SERVER");

l.i("Initializing...");
let app: express.Express;
try {
  app = express();
} catch (err) {
  l.e(`Initializing failed: ${err}`);
  process.exit(1);
}
l.s("Initialized");

l.i("Setting up auth...");
try {
  setup(app);
} catch (err) {
  l.e(`Setting up auth failed: ${err}`);
  process.exit(1);
}
l.s("Set up auth");

const services: (() => express.Router)[] = [books];
const nServices = services.length;
l.i(`Registering services ${nServices}...`);
const failedServices: string[] = [];
for (const service of services) {
  l.i(`Registering service "${service.name}"...`);
  try {
    const api = service();
    app.use(`/${service.name}`, auth, api);
    l.s(`Registered service "${service.name}"`);
  } catch (err) {
    l.e(`Registering service "${service.name}" failed: ${err}`);
    failedServices.push(service.name);
  }
}
if (failedServices.length > 0) {
  l.w(
    `Registered services ${nServices - failedServices.length}/${nServices}: Failed services:`,
  );
  for (const service of failedServices) {
    l.w(`- ${service}`);
  }
} else {
  l.s(`Registered services ${nServices}/${nServices}`);
}

l.i("Starting...");

app.listen(SERVER_LOCAL_PORT, SERVER_LOCAL_IP, () => {
  l.s(`Started`);
  l.i(`Listening on ${SERVER_LOCAL_IP}:${SERVER_LOCAL_PORT}`);
});
