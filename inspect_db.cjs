(async () => {
  const [{ Client }, dotenv] = await Promise.all([
    import("pg"),
    import("dotenv"),
  ]);
  dotenv.config();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query(`
      SELECT u.email, a.providerId, a.issuer, a.accountId, a.userId,
             a.password IS NOT NULL AS "passwordPresent",
             length(a.password) AS "passwordLength"
      FROM "User" u
      LEFT JOIN "Account" a ON a."userId" = u.id
      ORDER BY u.email
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
})().catch((error) => {
  console.error("Database inspection failed:", error.message);
  process.exitCode = 1;
});
