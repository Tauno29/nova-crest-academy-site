import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../../server/_core/oauth";
import { registerStorageProxy } from "../../server/_core/storageProxy";
import { createContext } from "../../server/_core/context";
import { appRouter } from "../../server/routers";
import { ADMIN_SESSION_COOKIE, createAdminSession, getAdminCookieOptions, validateAdminCredentials } from "../../server/adminAuth";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

app.post("/api/desktop/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!validateAdminCredentials(email, password)) {
    res.status(401).json({ error: "The administrator email or password is incorrect." });
    return;
  }

  const token = await createAdminSession(email);
  res.cookie(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions(req));
  res.json({ success: true, email: email.trim().toLowerCase() });
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export const handler = serverless(app);
