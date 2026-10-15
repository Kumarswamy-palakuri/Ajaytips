import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler, successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

// ── GET public settings (for frontend brand config) ───────────────────────────
router.get('/public', asyncHandler(async (req, res) => {
  const settings = await SiteSettings.find({ isPublic: true }).select('key value group');
  const result = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  return successResponse(res, { settings: result });
}));

// ── GET all settings (admin) ──────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const settings = await SiteSettings.find().sort('group key');
  return successResponse(res, { settings });
}));

// ── UPSERT setting (admin) ────────────────────────────────────────────────────
router.put('/:key', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { value, group, label, isPublic } = req.body;
  const setting = await SiteSettings.findOneAndUpdate(
    { key: req.params.key },
    { value, group, label, isPublic },
    { new: true, upsert: true, runValidators: true }
  );
  return successResponse(res, { setting }, 'Setting saved');
}));

// ── DELETE setting (admin) ────────────────────────────────────────────────────
router.delete('/:key', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await SiteSettings.deleteOne({ key: req.params.key });
  return successResponse(res, {}, 'Setting deleted');
}));

export default router;
