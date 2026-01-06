import jwt from "jsonwebtoken";

// MUST MATCH JWT_SECRET in .env
const JWT_SECRET = "ad026d992743431aa59f952bd0ca098f";

const token = jwt.sign(
  {
    id: "64f000000000000000000001", // fake user id
    role: "admin"                  // change to "user" if needed
  },
  JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

console.log("\nJWT TOKEN (copy this):\n");
console.log(token);
