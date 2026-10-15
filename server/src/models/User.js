import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['guest', 'student', 'content_editor', 'instructor', 'admin', 'super_admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: { type: String, select: false },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ROLES,
      default: 'student',
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // Email verification
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },
    // Password reset
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    // Refresh tokens (stored as hashed; supports multiple devices)
    refreshTokens: {
      type: [
        {
          token: String,
          createdAt: { type: Date, default: Date.now },
          userAgent: String,
        },
      ],
      select: false,
      default: [],
    },
    profile: {
      bio: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      qualification: { type: String, default: '' },
      targetExam: { type: String, default: '' },
    },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      jobs: { type: Boolean, default: true },
      tests: { type: Boolean, default: true },
      courses: { type: Boolean, default: true },
    },
    lastLoginAt: Date,
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// email index is created automatically via unique:true on the field
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// ── Pre-save: hash password ───────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance method: compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Never return sensitive fields ─────────────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.refreshTokens;
  delete obj.emailVerifyToken;
  delete obj.emailVerifyExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
