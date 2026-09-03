import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        phone: { type: "string" },
    },
  },
});

export type User = typeof auth.$Infer.Session.user;
