import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  getAdminCookieOptions,
  validateAdminCredentials,
} from "./adminAuth";
import { hasJwtSecret, JWT_CONFIGURATION_ERROR } from "./authSecret";

/**
 * Builds the API-only Express app used by external serverless hosts.
 * Static files are served by the host's Vite output, not by this function.
 */
export function createApiApp() {
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
    if (!hasJwtSecret()) {
      res.status(500).json({ error: JWT_CONFIGURATION_ERROR });
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

  return app;
}
