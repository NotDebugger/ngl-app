import jwt from "jsonwebtoken";

export async function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
}
