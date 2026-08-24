import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("Netlify deployment contract", () => {
  it("publishes the Vite output and routes API and SPA requests correctly", () => {
    const config = readProjectFile("netlify.toml");

    expect(config).toContain('command = "pnpm build:netlify"');
    expect(config).toContain('publish = "dist/public"');
    expect(config).toContain('functions = "netlify/functions"');
    expect(config).toContain('from = "/api/*"');
    expect(config).toContain('to = "/.netlify/functions/api/:splat"');
    expect(config).toContain('from = "/manus-storage/*"');
    expect(config).toContain('to = "/.netlify/functions/api/manus-storage/:splat"');
    expect(config).toContain('from = "/*"');
    expect(config).toContain('to = "/index.html"');
  });

  it("keeps the Netlify function entrypoint and build script present", () => {
    const packageJson = JSON.parse(readProjectFile("package.json")) as { scripts?: Record<string, string> };
    const functionSource = readProjectFile("netlify/functions/api.ts");

    expect(packageJson.scripts?.["build:netlify"]).toBe("vite build");
    expect(functionSource).toContain('import serverless from "serverless-http"');
    expect(functionSource).toContain("createExpressMiddleware");
    expect(functionSource).toContain("export const handler = serverless(app)");
  });
});
