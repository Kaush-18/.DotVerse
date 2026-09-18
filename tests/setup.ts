// The cancellation tests mock database access, but lib/prisma is evaluated
// during module loading. Provide a disposable test-only URL before that import.
process.env.DATABASE_URL ??= "postgresql://test@localhost/test?sslmode=disable";
