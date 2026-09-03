import type { User } from "./lib/auth";
// If this compiles, then it's safe.
const u: User = { firstName: "a", lastName: "b", phone: "c", id: "1", email: "d", emailVerified: true, name: "e", createdAt: new Date(), updatedAt: new Date() };
console.log(u);
