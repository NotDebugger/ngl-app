import bcrypt from "bcrypt";

export async function hash(password) {
  return await bcrypt.hash(password, 10);
}

export async function compareHash(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
