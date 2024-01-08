"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpTransporter = exports.refreshTokenCookieOptions = exports.corsOptions = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var constants_1 = require("./constants");
exports.corsOptions = {
    origin: function (requestOrigin, callback) {
        if (constants_1.ALLOWED_ORIGIN.includes(requestOrigin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by Cors'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
};
exports.refreshTokenCookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
};
exports.smtpTransporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
