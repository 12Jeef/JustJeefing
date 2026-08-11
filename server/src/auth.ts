import {
  EMAIL_WHITELIST,
  GOOGLE_CLIENT_ID,
  LOGIN_LASTS_FOR,
} from "./config.js";
import { OAuth2Client } from "google-auth-library";
import express from "express";
import logger from "./logger.js";
import { makeErrorResponse, makeSuccessResponse } from "./util.js";
import crypto from "node:crypto";
import cookieParser from "cookie-parser";

const l = logger.child("AUTH");

l.i("Initializing...");
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const sessions: Map<string, { email: string; expires: number }> = new Map();
l.i("Initialized");

l.i(`↪ E-mail whitelist: ${EMAIL_WHITELIST.join(", ")}`);
l.i(`↪ Expiration: ${LOGIN_LASTS_FOR / 1e3 / 60 / 60}hr`);

export const setup = (app: express.Express) => {
  l.i("Setting up API...");

  app.use(cookieParser());
  app.post("/auth", async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) {
      res.status(400).json(makeErrorResponse("Missing ID token"));
      return;
    }
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload?.email;
      if (!email || !EMAIL_WHITELIST.includes(email)) {
        res.status(403).json(makeErrorResponse("Not whitelisted"));
        return;
      }
      const sessionId = crypto.randomBytes(32).toString("hex");
      sessions.set(sessionId, {
        email,
        expires: Date.now() + LOGIN_LASTS_FOR,
      });
      res.cookie("session", sessionId, {
        httpOnly: true,
        maxAge: LOGIN_LASTS_FOR,
      });
      res.json(makeSuccessResponse(null));
    } catch (err) {
      res.status(401).json(makeErrorResponse("Invalid Google token"));
    }
  });

  l.s("Set up API");
};

export const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const sessionId = req.cookies.session;
  l.i(`Checking ${sessionId}...`);
  const session = sessions.get(sessionId);
  if (!session) {
    l.w("↪ Session does not exist");
    res.sendStatus(401);
    return;
  }
  if (session.expires < Date.now()) {
    l.w("↪ Session expired");
    sessions.delete(sessionId);
    res.sendStatus(401);
    return;
  }
  l.s("↪ Session authenticated");
  next();
};
