import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().min(2).max(120),
        email: z.string().email().max(255),
        company: z.string().max(120).optional(),
        message: z.string().min(10).max(5000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { enqueueTransactionalEmail } = await import(
      "@/lib/email/enqueue.server"
    );

    const result = await enqueueTransactionalEmail({
      templateName: "contact-submission",
      recipientEmail: "hello@opusdrinks.com",
      templateData: {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
      },
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return { ok: true };
  });
