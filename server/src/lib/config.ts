import { CorsOptions } from 'cors';
import { CookieOptions } from 'express';
import nodemailer from 'nodemailer';

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (requestOrigin === undefined || requestOrigin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by Cors'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

export const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});
