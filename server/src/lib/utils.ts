import { UUID, randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload, ResetTokenPayload } from './types';
import { smtpTransporter } from './config';

// export const getIp = (req: Request) =>
//   (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();

// export const addIp = async (email: string, ip: string | undefined): Promise<Profile | null> => {
//   try {
//     const updatedProfile = await db.profile.update({
//       where: { email },
//       data: { ip },
//     });
//     return updatedProfile;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

export const uuid: () => string | UUID = randomUUID;

const TRUTHY = [1, true, '1', 'true'];
export const isTruthy = (value: any) => TRUTHY.includes(value);

export const convertMbToBytes = (mb: number) => mb * Math.pow(1024, 2);

export const getFormatedDate = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

export type GenTokenOption =
  | {
      type: 'accessToken';
      payload: AccessTokenPayload;
    }
  | { type: 'refreshToken'; payload: RefreshTokenPayload }
  | { type: 'resetToken'; payload: ResetTokenPayload };
export type TokenType = GenTokenOption['type'];
export const tokenOptionsMap: Record<
  TokenType,
  {
    secret: string;
    jwtOptions: jwt.SignOptions;
  }
> = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET as string,
    jwtOptions: {
      expiresIn: '15m',
    },
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    jwtOptions: {
      expiresIn: '1h',
    },
  },
  resetToken: {
    secret: process.env.RESET_TOKEN_SECRET as string,
    jwtOptions: {
      expiresIn: '30m',
    },
  },
};

export const genToken = (arg: GenTokenOption) => {
  const tokenOptions = tokenOptionsMap[arg.type];
  return jwt.sign(arg.payload, tokenOptions.secret, tokenOptions.jwtOptions);
};

export type DecodeTokenReturn = {
  accessToken: AccessTokenPayload;
  refreshToken: RefreshTokenPayload;
  resetToken: ResetTokenPayload;
};

export const decodeToken = <T extends TokenType, R = DecodeTokenReturn[T]>(arg: {
  type: T;
  token: string;
}): R | null => {
  let result: R | null = null;
  jwt.verify(arg.token, tokenOptionsMap[arg.type].secret, (err, decoded) => {
    if (!err) {
      result = decoded as R;
    }
  });
  return result;
};

export const sendPasswordResetEmail = (arg: { email: string; token: string }) => {
  const resetLink = `http://localhost:5173/reset/${arg.token}`;
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: arg.email,
    subject: 'Roomies: Reset password',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  smtpTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export type ReturnMessage =
  | { type: 'success'; successMessage?: string }
  | { type: 'invalid'; invalidMessage?: string }
  | { type: 'error'; errorMessage?: string };

export const createMsg = (arg: ReturnMessage) => {
  switch (arg.type) {
    case 'success':
      return {
        success: arg.successMessage || 'Execute action successfully',
      };
    case 'invalid':
      return {
        invalid: arg.invalidMessage || 'Bad Request',
      };
    case 'error':
      return {
        error: arg.errorMessage || 'Internal Server Error',
      };
  }
};
