import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
// import { withCache } from "../../lib/cache/with-cache.js";
// import { User } from "../user/model/user.model.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";

export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.patch("/verify-account", authController.verifyAccount);
authRouter.post("/login", authController.login);
authRouter.post("/send-otp", authController.sendOTP);
authRouter.patch(
  "/reset-password",
  idempotency(),
  authController.resetPassword,
);
authRouter.post("/google", authController.loginWithGoogle);
authRouter.patch(
  "/enable-2-step-verification",
  authController.twoStepVerification,
);

authRouter.post("/verify-to-login", authController.verifyCodeToLogin);

// authRouter.get("/get-all-users", withCache(), async (req, res, next) => {
//   const users = await User.find();
//   res.json({ success: true, users });
// });
