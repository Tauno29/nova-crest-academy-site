import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("Vercel deployment contract", () => {
  it("uses the Vite output and keeps client-side routes out of the API function", () => {
    const config = JSON.parse(readProjectFile("vercel.json")) as {
      buildCommand?: string;
      outputDirectory?: string;
      installCommand?: string;
      framework?: string;
      rewrites?: Array<{ source?: string; destination?: string }>;
    };

    expect(config.framework).toBe("vite");
    expect(config.buildCommand).toBe("pnpm build:vercel");
    expect(config.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(config.outputDirectory).toBe("client/dist");
    expect(config.rewrites).toContainEqual({
      source: "/((?!api/).*)",
      destination: "/index.html",
    });
  });

  it("keeps the shared Express/tRPC API as a Vercel catch-all function", () => {
    const packageJson = JSON.parse(readProjectFile("package.json")) as { scripts?: Record<string, string> };
    const functionSource = readProjectFile("api/[...path].ts");
    const appSource = readProjectFile("server/apiApp.ts");

    expect(packageJson.scripts?.["build:vercel"]).toBe("vite build --outDir dist");
    expect(packageJson.scripts?.["vercel-build"]).toBe("vite build --outDir dist");
    expect(functionSource).toContain('import { createApiApp } from "../server/apiApp"');
    expect(functionSource).toContain("export default app");
    expect(appSource).toContain('"/api/trpc"');
    expect(appSource).toContain('"/api/desktop/login"');
  });
});
