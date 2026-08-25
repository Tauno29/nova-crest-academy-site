import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createVercelTrpcContext } from "../../server/vercelTrpc";

export default {
  async fetch(request: Request) {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: createVercelTrpcContext,
    });
  },
};
