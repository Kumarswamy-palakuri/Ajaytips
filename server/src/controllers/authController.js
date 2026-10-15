import crypto from 'crypto';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
  cookieOptions,
} from '../utils/tokenUtils.js';
import { sendEmail, emailTemplates } from '../utils/mailer.js';
import { asyncHandler, successResponse, errorResponse } from '../utils/apiResponse.js';

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return errorResponse(res, 'Email already registered', 409);

  const verifyToken = generateOpaqueToken();
  const hashedToken = hashToken(verifyToken);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    emailVerifyToken: hashedToken,
    emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}&id=${user._id}`;

  try {
    const tmpl = emailTemplates.verifyEmail(user.name, verifyUrl);
    await sendEmail({ to: user.email, ...tmpl });
  } catch {
    // Non-fatal: log but don't fail registration
    console.error('Verification email failed to send');
  }

  return successResponse(
    res,
    { userId: user._id },
    'Registration successful. Please verify your email.',
    201
  );
});

// ── VERIFY EMAIL ──────────────────────────────────────────────────────────────
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token, id } = req.query;
  if (!token || !id) return errorResponse(res, 'Invalid verification link', 400);

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    _id: id,
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: Date.now() },
  }).select('+emailVerifyToken +emailVerifyExpires');

  if (!user) return errorResponse(res, 'Invalid or expired verification link', 400);

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  const tmpl = emailTemplates.welcomeEmail(user.name);
  sendEmail({ to: user.email, ...tmpl }).catch(console.error);

  return successResponse(res, {}, 'Email verified successfully. You can now log in.');
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user) return errorResponse(res, 'Invalid email or password', 401);
  if (!user.isActive) return errorResponse(res, 'Account suspended. Contact support.', 403);
  if (!user.isVerified) return errorResponse(res, 'Please verify your email before logging in.', 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

  // Issue tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Store hashed refresh token
  const hashedRefresh = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter(
    (t) => new Date(t.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ); // prune old tokens
  user.refreshTokens.push({
    token: hashedRefresh,
    userAgent: req.headers['user-agent'] || '',
  });
  user.lastLoginAt = new Date();
  user.loginCount += 1;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return successResponse(res, {
    accessToken,
    user: user.toJSON(),
  }, 'Login successful');
});

// ── REFRESH TOKEN ─────────────────────────────────────────────────────────────
export const refreshTokens = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return errorResponse(res, 'Refresh token not found', 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.isActive) return errorResponse(res, 'User not found', 401);

  const hashedIncoming = hashToken(token);
  const tokenEntry = user.refreshTokens.find((t) => t.token === hashedIncoming);
  if (!tokenEntry) return errorResponse(res, 'Refresh token revoked', 401);

  // Rotate: remove old, add new
  const newRefreshToken = generateRefreshToken({ id: user._id });
  const hashedNew = hashToken(newRefreshToken);

  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashedIncoming);
  user.refreshTokens.push({ token: hashedNew, userAgent: req.headers['user-agent'] || '' });
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  return successResponse(res, { accessToken }, 'Token refreshed');
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const hashedToken = hashToken(token);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { token: hashedToken } },
    });
  }
  res.clearCookie('refreshToken', { path: '/' });
  return successResponse(res, {}, 'Logged out successfully');
});

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return success to prevent email enumeration
  if (!user) return successResponse(res, {}, 'If that email exists, a reset link has been sent.');

  const resetToken = generateOpaqueToken();
  const hashedToken = hashToken(resetToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;
  const tmpl = emailTemplates.resetPassword(user.name, resetUrl);

  try {
    await sendEmail({ to: user.email, ...tmpl });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return errorResponse(res, 'Email could not be sent. Try again later.', 500);
  }

  return successResponse(res, {}, 'If that email exists, a reset link has been sent.');
});

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, id } = req.query;
  const { password } = req.body;

  if (!token || !id) return errorResponse(res, 'Invalid reset link', 400);

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    _id: id,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires +refreshTokens');

  if (!user) return errorResponse(res, 'Invalid or expired reset link', 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // Revoke all sessions
  await user.save();

  return successResponse(res, {}, 'Password reset successful. Please log in.');
});

// ── GET ME ────────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return successResponse(res, { user });
});

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar', 'profile'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  return successResponse(res, { user }, 'Profile updated');
});

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password +refreshTokens');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return errorResponse(res, 'Current password is incorrect', 400);

  user.password = newPassword;
  user.refreshTokens = []; // revoke all other sessions
  await user.save();

  res.clearCookie('refreshToken', { path: '/' });
  return successResponse(res, {}, 'Password changed. Please log in again.');
});
