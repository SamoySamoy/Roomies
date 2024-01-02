import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { UUID, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload, ResetTokenPayload } from './types';
import { smtpTransporter } from './config';
import { CLIENT_LOCATION, IMAGE_EXT_LIST, TRUTHY } from './constants';
import { db } from '@/prisma/db';

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

export const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

export const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

export const uuid: () => string | UUID = randomUUID;

export const isTruthy = (value: any) => TRUTHY.includes(value);

export const convertMbToBytes = (mb: number) => mb * Math.pow(1024, 2);

export const getFormatedDate = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

export const getExtName = (filename: string) => {
  return path.extname(filename).slice(1).toLowerCase();
};

export const getFileName = (filename: string) => {
  return path.parse(filename).name;
};

export const isImageFile = (filename: string | undefined | null) => {
  if (!filename) return false;
  // path.extname trả về đuôi file có chấm ở đầu (VD: .img, .pdf)
  const fileExt = getExtName(filename);
  return IMAGE_EXT_LIST.includes(fileExt);
};

export const mkdirIfNotExist = async (absFolderPath: string) => {
  if (fs.existsSync(absFolderPath)) return;

  await fsPromises.mkdir(absFolderPath, {
    recursive: true,
  });
};

export const removeIfExist = async (absFolderPath: string) => {
  if (!fs.existsSync(absFolderPath)) return;

  await fsPromises.unlink(absFolderPath);
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
      expiresIn: '30m',
    },
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET as string,
    jwtOptions: {
      expiresIn: '12h',
    },
  },
  resetToken: {
    secret: process.env.RESET_TOKEN_SECRET as string,
    jwtOptions: {
      expiresIn: '1h',
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
  const resetLink = `${CLIENT_LOCATION}/reset/${arg.token}`;
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

export type ReturnResult<T> =
  | {
      type: 'one';
      item: T;
    }
  | {
      type: 'paging:cursor';
      items: T;
      lastCursor: string | number | null | undefined;
    };

export const createResult = <T>(arg: ReturnResult<T>) => {
  switch (arg.type) {
    case 'one':
      return arg.item;
    case 'paging:cursor':
      return {
        items: arg.items,
        lastCursor: arg.lastCursor,
      };
  }
};
