import express from "express";
import logger from "./logger.js";
import { SERVER_LOCAL_PORT, SERVER_LOCAL_IP } from "./config.js";
import books from "./services/books/books.js";
import { Service } from "./types.js";

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

const l2 = l.child("SERVICES");

const services: Service[] = [books];
const nServices = services.length;
l2.i(`Registering ${nServices}...`);
const failedServices: string[] = [];
for (const service of services) {
  l2.i(`Registering ${service.name}...`);
  try {
    const router = service();
    app.use(service.name, router);
    l2.s(`Registered ${service.name}`);
  } catch (err) {
    l2.e(`Registering ${service.name} failed: ${err}`);
    failedServices.push(service.name);
  }
}
if (failedServices.length > 0) {
  l2.w(
    `Registered ${nServices - failedServices.length}/${nServices}: Failed services:`,
  );
  for (const service of failedServices) {
    l2.w(`- ${service}`);
  }
} else {
  l2.s(`Registered ${nServices}/${nServices}`);
}

l.i("Starting...");

app.listen(SERVER_LOCAL_PORT, SERVER_LOCAL_IP, () => {
  l.s(`Started`);
  l.i(`Listening on ${SERVER_LOCAL_IP}:${SERVER_LOCAL_PORT}`);
});
