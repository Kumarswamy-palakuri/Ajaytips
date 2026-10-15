import rateLimit from 'express-rate-limit';

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

// General API rate limit
export const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 min
  200,
  'Too many requests, please try again in 15 minutes.'
);

// Strict limit for auth endpoints
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many auth attempts, please try again in 15 minutes.'
);

// Password reset / OTP
export const sensitiveOpLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  5,
  'Too many sensitive requests, please wait an hour before trying again.'
);
