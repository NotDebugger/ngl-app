import jwt from "jsonwebtoken";
import { AppError } from "../../pkg/error/error.js";
import { env } from "../config/env.js";

export function guard(req, res, next) {
  try {
    const token = req.cookies.access_token;
    if (!token) throw new AppError("No token provided", 403);
    req.user = jwt.verify(token, env.jwt.secret);

    next();
  } catch (err) {
    next(err);
  }
}
