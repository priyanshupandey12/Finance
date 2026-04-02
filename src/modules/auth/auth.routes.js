const express = require("express");
const router= express.Router();
const {ForgotPassword,GetMe,Login,Logout,RefreshToken,Register,ResetPassword,VerifyEmail}=require("./auth.controller.js");
const { authenticate } = require("./auth.middleware.js");
const {registerSchema}=require("./authValidation/register.validation.js")
const {loginSchema}=require("./authValidation/login.validation.js")
const { validate } = require("../../comman/middleware/validation.middlware.js");

router.post("/register", validate(registerSchema), Register);
router.post("/login", validate(loginSchema), Login);
router.post("/refresh-token", RefreshToken);
router.post("/logout", authenticate, Logout);
router.get("/verify-email/:token", VerifyEmail);
router.post(
  "/forgot-password",
  ForgotPassword,
);
router.put(
  "/reset-password/:token",
  ResetPassword,
);
router.get("/me", authenticate, GetMe);

module.exports = router;