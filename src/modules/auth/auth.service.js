const crypto = require('crypto');
const ApiError = require('../../comman/utils/api-error');
const Auth = require('./auth.modal');
const { generateAccessToken, generateRefreshToken ,generateResetToken,verifyRefreshToken} = require('../../comman/utils/jwt-utils');
const { sendVerificationEmail } = require('../../comman/config/email.config');


const hashToken=(token)=>{
   return crypto.createHash('sha256').update(token).digest('hex');
}

const register=async({name,email,password,role})=>{
    const existingUser=await Auth.findOne({email});
    if(existingUser){
        throw ApiError.conflict("User already exists");
    }
   const {rawToken,hashedToken}=generateResetToken();
    const user=await Auth.create({
        name,
        email,
        password,
        role,
        verificationToken:hashedToken,
    });

    try {
        await sendVerificationEmail(email,rawToken);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }

    const userObj=user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    return userObj;

}

const login=async({email,password})=>{
    const user=await Auth.findOne({email}).select('+password');
    if(!user){
        throw ApiError.unauthorized("Invalid email or password");
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        throw ApiError.unauthorized("Invalid email or password");
    }

    if(!user.isVerified){
        throw ApiError.unauthorized("Please verify your email before logging in");
    }

    const accessToken=generateAccessToken({id:user._id,role:user.role});
    const refreshToken=generateRefreshToken({id:user._id});

    user.refreshToken=hashToken(refreshToken);
    await user.save({validateBeforeSave:false})

      const userObj=user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return {user:userObj,accessToken,refreshToken};
}

const refreshToken=async(refreshToken)=>{
    if(!refreshToken){
        throw ApiError.unauthorized("Refresh token is required");
    }
    const decoded=verifyRefreshToken(refreshToken);
    const user=await Auth.findById(decoded.id).select('+refreshToken');
    if(!user || user.refreshToken!==hashToken(refreshToken)){
        throw ApiError.unauthorized("Invalid refresh token");
    }
    const accessToken=generateAccessToken({id:user._id,role:user.role});

    return {accessToken};
}

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};


const verifyEmail = async (token) => {
  const trimmed = String(token).trim();
  if (!trimmed) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }

  const hashedInput = hashToken(trimmed);
  let user = await Auth.findOne({ verificationToken: hashedInput }).select(
    "+verificationToken",
  );
  if (!user) {
    user = await Auth.findOne({ verificationToken: trimmed }).select(
      "+verificationToken",
    );
  }
  if (!user) throw ApiError.badRequest("Invalid or expired verification token");

  await Auth.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  return user;
};


const forgotPassword = async (email) => {
  const user = await Auth.findOne({ email });
  if (!user) throw ApiError.notFound("No account with that email");

  const { rawToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await Auth.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

const getMe = async (userId) => {
  const user = await Auth.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

module.exports={
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe
}
