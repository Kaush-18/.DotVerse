-- Required by Better Auth 1.7.2 to namespace credential and OAuth accounts.
ALTER TABLE "Account" ADD COLUMN "issuer" TEXT NOT NULL;
