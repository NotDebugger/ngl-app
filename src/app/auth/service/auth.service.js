import * as authRepository from "../repository/auth.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import { cacheProvider } from "../../../lib/cache/init.js";
import { sendMailProvider } from "../../../lib/email/init.js";
import {
  userNotExist,
  userAlreadyExist,
  userAlreadyVerified,
  userNotVerified,
} from "../../user/errors.js";
import { otpExpired, invalidCode, invalidEmailOrPassword } from "../errors.js";
import { generateOtp } from "../utils/otp.js";
import { hash, compareHash } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import { verifyGoogleToken } from "../../../lib/utils/google-auth.js";

// Create sign up service
export async function signup(userData) {
  const userExist = await authRepository.checkUserExistByEmail(userData.email);
  if (userExist) throw userAlreadyExist;

  userData.password = await hash(userData.password);

  const createdUser = await authRepository.createUser(userData);

  const otp = await generateOtp();
  const hashedOtp = await hash(otp);

  const key = `otp:${userData.email}`;
  await cacheProvider.set(key, hashedOtp, 900);

  // send email
  await sendMailProvider.sendEmail(
    userData.email,
    "Verification Code",
    `<p>Your verification code is <b>${otp}</b></p>`,
  );

  return createdUser;
}

// Create verify account service
export async function verifyAccount(email, code) {
  const userExist = await authRepository.checkUserExistByEmail(email);
  if (!userExist) throw userNotExist;

  if (userExist.isVerified) throw userAlreadyVerified;

  const hashedOtp = await cacheProvider.get(`otp:${email}`);
  if (!hashedOtp) throw otpExpired;

  const match = await compareHash(code, hashedOtp);
  if (!match) throw invalidCode;

  await cacheProvider.del(`otp:${email}`);
  return await userRepository.updateUserByEmail(email, { isVerified: true });
}

// Create 2 step verification service
export async function twoStepVerification(email, code) {
  const userExist = await authRepository.checkUserExistByEmail(email);
  if (!userExist) throw userNotExist;

  const hashedOtp = await cacheProvider.get(`otp:${email}`);
  if (!hashedOtp) throw otpExpired;

  const match = await compareHash(code, hashedOtp);
  if (!match) throw invalidCode;

  await cacheProvider.del(`otp:${email}`);
  return await userRepository.updateUserByEmail(email, {
    twoStepVerification: true,
  });
}

// Create verify Code To Login service
export async function verifyCodeToLogin(email, code) {
  const userExist = await authRepository.checkUserExistByEmail(email);
  if (!userExist) throw userNotExist;

  const hashedOtp = await cacheProvider.get(`otp:${email}`);
  if (!hashedOtp) throw otpExpired;

  const match = await compareHash(code, hashedOtp);
  if (!match) throw invalidCode;

  await cacheProvider.del(`otp:${email}`);

  return generateToken({
    id: userExist._id,
    email: userExist.email,
    name: userExist.name,
  });
}

// Create login service
export async function login(email, password) {
  const userExist = await authRepository.checkUserExistByEmail(email);
  if (!userExist) throw userNotExist;

  if (!userExist.isVerified) throw userNotVerified;

  const match = await compareHash(password, userExist.password);

  if (!match) throw invalidEmailOrPassword;

  if (userExist.twoStepVerification) {
    const otp = await generateOtp();
    const hashedOtp = await hash(otp);

    await cacheProvider.set(`otp:${email}`, hashedOtp, 900);

    // send email
    await sendMailProvider.sendEmail(
      email,
      "2 Step Verification Code",
      `<p>Your 2 Step verification code is <b>${otp}</b></p>`,
    );
    return;
  }
  return generateToken({
    id: userExist._id,
    email: userExist.email,
    name: userExist.name,
  });
}

// Create send otp function (for FORGET PASSWORD SERVICE)
export async function sendOTP(email) {
  const userExist = await authRepository.checkUserExistByEmail(email);
  if (!userExist) throw userNotExist;

  const otp = await generateOtp();
  const hashedOtp = await hash(otp);

  await cacheProvider.set(`otp:${email}`, hashedOtp, 900);

  // send email
  await sendMailProvider.sendEmail(
    email,
    "Verification Code",
    `<p>Your verification code is <b>${otp}</b></p>`,
  );
}

// Create reset password function (for FORGET PASSWORD SERVICE)
export async function resetPassword(email, newPassword, code) {
  const hashedOtp = await cacheProvider.get(`otp:${email}`);
  if (!hashedOtp) throw otpExpired;

  const match = await compareHash(code, hashedOtp);
  if (!match) throw invalidCode;

  await cacheProvider.del(`otp:${email}`);

  const hashedPassword = await hash(newPassword);
  await userRepository.updateUserByEmail(email, { password: hashedPassword });
}

export async function loginWithGoogle(idToken) {
  const payload = await verifyGoogleToken(idToken);

  const user = await authRepository.checkUserExistByEmail(payload.email);
  if (user) {
    return await generateToken({
      id: payload._id,
      email: payload.email,
      name: payload.name,
    });
  }
  const createdUser = await authRepository.createUser({
    name: payload.name,
    email: payload.email,
    provider: "google",
    isVerified: true,
  });

  return await generateToken({
    id: createdUser._id,
    email: createdUser.email,
    name: createdUser.name,
  });
}
