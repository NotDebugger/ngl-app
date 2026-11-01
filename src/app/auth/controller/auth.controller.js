import * as authService from "../service/auth.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import {
  signupDTO,
  verifyAccountDTO,
  loginDTO,
  sendOtpDTO,
  resetPasswordDTO,
  loginWithGoogleDTO,
  twoStepVerificationDTO,
} from "../dto/auth.dto.js";

export async function signup(req, res, next) {
  try {
    const data = validateBody(signupDTO, req.body);

    await authService.signup(data);
    res.json({
      message: "User created successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function twoStepVerification(req, res, next) {
  try {
    const data = validateBody(twoStepVerificationDTO, req.body);
    const { email, code } = data;

    await authService.twoStepVerification(email, code);
    res.json({
      message: "enable 2 step verification successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyAccount(req, res, next) {
  try {
    const data = validateBody(verifyAccountDTO, req.body);
    const { email, code } = data;

    await authService.verifyAccount(email, code);
    res.json({
      message: "User verified successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyCodeToLogin(req, res, next) {
  try {
    const { email, code } = req.body;

    const token = await authService.verifyCodeToLogin(email, code);
    res.cookie("access_token", token, { maxAge: 3600 });

    res.json({
      message: "User verified successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = validateBody(loginDTO, req.body);
    const { email, password } = data;

    const token = await authService.login(email, password);
    if (token) {
      return res.json({
        message: "please check your inbox",
        success: true,
      });
    }
    res.cookie("access_token", token, { maxAge: 3600 });

    res.json({
      message: "User Logged in successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendOTP(req, res, next) {
  try {
    const data = validateBody(sendOtpDTO, req.body);

    await authService.sendOTP(data.email);

    res.json({
      message: "OTP sent successfully, check your email",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const data = validateBody(resetPasswordDTO, req.body);

    const { email, newPassword, code } = data;
    await authService.resetPassword(email, newPassword, code);

    res.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function loginWithGoogle(req, res, next) {
  try {
    // const data = validateBody(loginWithGoogleDTO, req.body);

    const token = await authService.loginWithGoogle(req.body.credential);
    res.cookie("access_token", token, { httpOnly: true, maxAge: 3600 });

    res.json({
      message: "User login successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
