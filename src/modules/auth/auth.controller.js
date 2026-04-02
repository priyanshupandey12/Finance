const ApiResponse = require('../../comman/utils/api.response');
const {register,login,forgotPassword,getMe,refreshToken,resetPassword,verifyEmail,logout}=require('./auth.service')

const Register=async(req,res)=>{
    const user= await register(req.body);
    ApiResponse.created(res,"User registered successfully", user);
}

const Login=async(req,res)=>{
    const {user,accessToken,refreshToken}= await login(req.body);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    ApiResponse.ok(res,"User logged in successfully", {user,accessToken});
}

const RefreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await refreshToken(token);
  ApiResponse.ok(res, "Token refreshed", { accessToken });
};

const Logout = async (req, res) => {
  await logout(req.user.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "Logged out successfully");
};

const VerifyEmail = async (req, res) => {
  await verifyEmail(req.params.token);
  ApiResponse.ok(res, "Email verified successfully");
};

const ForgotPassword = async (req, res) => {
  await forgotPassword(req.body.email);
  ApiResponse.ok(res, "Password reset email sent");
};

const ResetPassword = async (req, res) => {
  await resetPassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "Password reset successful");
};

const GetMe = async (req, res) => {
  const user = await getMe(req.user.id);
  ApiResponse.ok(res, "User profile", user);
};

module.exports = {
  Register,
  Login,
  RefreshToken,
  Logout,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  GetMe,
};


