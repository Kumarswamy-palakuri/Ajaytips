import { verifyAccessToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

// ── Authenticate — require valid JWT access token ────────────────────────────
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or account suspended', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired', 401);
    }
    return errorResponse(res, 'Invalid token', 401);
  }
};

// ── Optional auth — attach user if token present, but don't block ────────────
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (user?.isActive) req.user = user;
  } catch {
    // Silently fail — route is public
  }
  next();
};

// ── RBAC — role hierarchy ─────────────────────────────────────────────────────
const ROLE_HIERARCHY = {
  guest: 0,
  student: 1,
  content_editor: 2,
  instructor: 2,
  admin: 3,
  super_admin: 4,
};

export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user) return errorResponse(res, 'Authentication required', 401);

    const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
    const requiredLevel = Math.min(...roles.map((r) => ROLE_HIERARCHY[r] ?? 99));

    if (userLevel < requiredLevel && !roles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }
    next();
  };

// Convenience wrappers
export const requireAdmin = authorize('admin', 'super_admin');
export const requireSuperAdmin = authorize('super_admin');
export const requireInstructor = authorize('instructor', 'admin', 'super_admin');
export const requireContentEditor = authorize('content_editor', 'instructor', 'admin', 'super_admin');
