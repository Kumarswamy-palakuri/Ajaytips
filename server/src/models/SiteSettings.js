import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed },
    group: {
      type: String,
      enum: ['branding', 'contact', 'social', 'payment', 'features', 'seo', 'email', 'misc'],
      default: 'misc',
    },
    label: { type: String },
    isPublic: { type: Boolean, default: false }, // exposed to frontend via /api/v1/settings/public
  },
  { timestamps: true }
);

// key index is created automatically via unique:true on the field
siteSettingsSchema.index({ group: 1, isPublic: 1 });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
