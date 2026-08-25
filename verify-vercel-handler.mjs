import http from "node:http";
import handler from "./.tmp-vercel-api-check/trpc/[...path].js";

const server = http.createServer((req, res) => handler(req, res));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

try {
  for (const path of ["learner.login", "admin.login"]) {
    const response = await fetch(`http://127.0.0.1:${port}/api/trpc/${path}?batch=1`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ 0: { json: path === "learner.login" ? { studentId: "NOT-A-REAL-STUDENT-ID", pin: "0000" } : { email: "not-admin@example.com", password: "not-a-real-password" } } }),
    });
    const body = await response.text();
    if (!response.headers.get("content-type")?.includes("application/json")) throw new Error(`${path}: non-JSON content type ${response.headers.get("content-type")}`);
    JSON.parse(body);
    console.log(`${path}: ${response.status} JSON`);
  }
} finally {
  server.close();
}
