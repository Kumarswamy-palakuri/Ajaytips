import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { asyncHandler, successResponse, errorResponse, paginatedResponse, getPagination } from '../utils/apiResponse.js';

const router = express.Router();

// ── GET all users (admin) ─────────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, role, isActive } = req.query;

  const filter = {};
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return paginatedResponse(res, users, total, page, limit);
}));

// ── GET single user (admin or self) ──────────────────────────────────────────
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const isSelf = req.user._id.toString() === req.params.id;
  const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
  if (!isSelf && !isAdmin) return errorResponse(res, 'Forbidden', 403);

  const user = await User.findById(req.params.id).select('-__v');
  if (!user) return errorResponse(res, 'User not found', 404);
  return successResponse(res, { user });
}));

// ── PATCH role (super_admin only) ─────────────────────────────────────────────
router.patch('/:id/role', authenticate, requireSuperAdmin, asyncHandler(async (req, res) => {
  const { role } = req.body;
  const valid = ['student', 'content_editor', 'instructor', 'admin', 'super_admin'];
  if (!valid.includes(role)) return errorResponse(res, 'Invalid role', 400);

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return errorResponse(res, 'User not found', 404);

  await AuditLog.create({
    actor: req.user._id,
    action: 'user.role_changed',
    target: `User:${user._id}`,
    meta: { oldRole: user.role, newRole: role },
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return successResponse(res, { user }, 'Role updated');
}));

// ── PATCH suspend/activate (admin) ────────────────────────────────────────────
router.patch('/:id/status', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') return errorResponse(res, 'isActive must be boolean', 400);

  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!user) return errorResponse(res, 'User not found', 404);

  await AuditLog.create({
    actor: req.user._id,
    action: isActive ? 'user.activated' : 'user.suspended',
    target: `User:${user._id}`,
    ip: req.ip,
  });

  return successResponse(res, { user }, `Account ${isActive ? 'activated' : 'suspended'}`);
}));

export default router;
