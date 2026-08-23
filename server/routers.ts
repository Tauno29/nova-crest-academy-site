import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ADMISSIONS_RECIPIENT, sendAdmissionsEmail } from "./emailjs";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    get: publicProcedure.input(z.object({ contentKey: z.string().min(1).max(100) })).query(() => ({ title: null as string | null, body: null as string | null })),
  }),
  admissions: router({
    submit: publicProcedure
      .input(z.object({ application: z.record(z.string(), z.string()).refine(value => Object.keys(value).length > 0) }))
      .mutation(async ({ input }) => {
        await sendAdmissionsEmail(input.application);
        return { success: true, recipient: ADMISSIONS_RECIPIENT } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
