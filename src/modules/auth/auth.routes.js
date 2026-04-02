const express = require("express");
const router= express.Router();
const {ForgotPassword,GetMe,Login,Logout,RefreshToken,Register,ResetPassword,VerifyEmail,DeleteUser,UpdateUserRole}=require("./auth.controller.js");
const { authenticate,authorize } = require("./auth.middleware.js");
const {registerSchema}=require("./authValidation/register.validation.js")
const {loginSchema}=require("./authValidation/login.validation.js")
const {forgotPasswordSchema}=require("./authValidation/forgotPassword.validation.js")
const {resetPasswordSchema}=require("./authValidation/forgotPassword.validation.js")
const { validate } = require("../../comman/middleware/validation.middlware.js");

router.post("/register", validate(registerSchema), Register);
router.post("/login", validate(loginSchema), Login);
router.post("/refresh-token", RefreshToken);
router.post("/logout", authenticate, Logout);
router.get("/verify-email/:token", VerifyEmail);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  ForgotPassword,
);
router.put(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  ResetPassword,
);
router.get("/me", authenticate, GetMe);
router.delete("/users/:id", authenticate,authorize('admin'), DeleteUser);
router.patch("/users/:id/role", authenticate,authorize('admin'), UpdateUserRole);

module.exports = router;