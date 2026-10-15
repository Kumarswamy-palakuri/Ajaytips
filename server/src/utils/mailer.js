import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || 'AjayTips <noreply@ajaytips.com>',
      to,
      subject,
      html,
      text,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw err;
  }
};

// ── Templates ─────────────────────────────────────────────────────────────────
export const emailTemplates = {
  verifyEmail: (name, url) => ({
    subject: 'Verify your AjayTips account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563EB">Welcome to AjayTips, ${name}!</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0">
          Verify Email
        </a>
        <p style="color:#666;font-size:14px">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  }),

  resetPassword: (name, url) => ({
    subject: 'Reset your AjayTips password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563EB">Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#666;font-size:14px">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  }),

  welcomeEmail: (name) => ({
    subject: 'Welcome to AjayTips!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563EB">You're verified! Welcome to AjayTips 🎉</h2>
        <p>Hi ${name}, your account is ready. Start exploring courses, mock tests, and government job notifications.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0">
          Go to Dashboard
        </a>
      </div>
    `,
  }),
};
