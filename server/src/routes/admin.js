import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler, successResponse, getPagination, paginatedResponse } from '../utils/apiResponse.js';

const router = express.Router();

// ── Platform analytics ────────────────────────────────────────────────────────
router.get('/overview', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    newUsersToday,
    roleBreakdown,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  return successResponse(res, {
    users: { total: totalUsers, active: activeUsers, newToday: newUsersToday },
    roleBreakdown,
  });
}));

// ── Audit log ─────────────────────────────────────────────────────────────────
router.get('/audit-logs', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { action } = req.query;
  const filter = action ? { action: new RegExp(action, 'i') } : {};

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('actor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return paginatedResponse(res, logs, total, page, limit);
}));

export default router;
