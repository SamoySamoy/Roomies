import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { db } from '@/prisma/db';
import { AuthenticatedRequest } from '@/lib/types';
import { refreshTokenCookieOptions } from '@/lib/config';
import { createMsg, genToken, decodeToken, sendPasswordResetEmail } from '@/lib/utils';

type BodyAuth = {
  email: string;
  password: string;
};

type RequestWithAuthBody = Request<any, any, Partial<BodyAuth>, any>;

export const register = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need email and password',
        }),
      );
    }

    const duplicateProfile = await db.profile.findUnique({
      where: { email },
    });
    if (duplicateProfile) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Email already in used',
        }),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newProfile = await db.profile.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(
      createMsg({
        type: 'success',
        successMessage: 'Profile created successfully!',
      }),
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const login = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need email and password',
        }),
      );
    }

    const profile = await db.profile.findUnique({
      where: { email },
    });
    if (!profile) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Email not found',
        }),
      );
    }

    const isRightPassword = await bcrypt.compare(password, profile.password);
    if (!isRightPassword) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Wrong email or password',
        }),
      );
    }

    // Có thể xảy ra trường hợp user chưa logout nhưng đã có thể login (TH này phải xử lý ở phía client, nhưng ở server cũng phải đảm bảo xử lý TH này)
    if (req.cookies.jwt) {
      // Detected old refresh token
      const oldRefreshToken = req.cookies.jwt;
      const oldRefreshTokenInDb = await db.refreshToken.findFirst({
        where: {
          refreshToken: oldRefreshToken,
          id: profile.id,
        },
      });
      if (oldRefreshTokenInDb) {
        await db.refreshToken.delete({
          where: {
            id: oldRefreshTokenInDb.id,
          },
        });
      } else {
        // Không tìm thấy trong DB tương ứng với oldRefreshToken bởi vì oldRefreshToken đã được sử dụng bởi hacker
        // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
        await db.refreshToken.deleteMany({
          where: {
            profileId: profile.id,
          },
        });
      }
      res.clearCookie('jwt', refreshTokenCookieOptions);
    }

    const accessToken = genToken({
      type: 'accessToken',
      payload: {
        profileId: profile.id,
        email: profile.email,
        imageUrl: profile.imageUrl,
      },
    });
    const refreshToken = genToken({
      type: 'refreshToken',
      payload: {
        profileId: profile.id,
      },
    });
    await db.refreshToken.create({
      data: {
        profileId: profile.id,
        refreshToken,
      },
    });
    res.cookie('jwt', refreshToken, refreshTokenCookieOptions);
    return res.status(200).json({
      accessToken,
      ...createMsg({
        type: 'success',
        successMessage: 'Login successfully',
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.cookies.jwt) return res.sendStatus(204);
  const refreshToken = req.cookies.jwt as string;
  const refreshTokenInDb = await db.refreshToken.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!refreshTokenInDb) {
    res.clearCookie('jwt', refreshTokenCookieOptions);
    return res.sendStatus(204);
  }

  await db.refreshToken.delete({
    where: {
      id: refreshTokenInDb.id,
    },
  });
  res.clearCookie('jwt', refreshTokenCookieOptions);
  return res.sendStatus(204);
};

export const forgot = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need email',
        }),
      );
    }
    const profile = await db.profile.findUnique({
      where: { email: email },
    });
    if (!profile) {
      return res.status(404).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Email not found',
        }),
      );
    }

    const resetToken = genToken({
      type: 'resetToken',
      payload: {
        profileId: profile.id,
      },
    });
    await db.resetToken.create({
      data: {
        profileId: profile.id,
        resetToken,
      },
    });

    sendPasswordResetEmail({
      email: profile.email,
      token: resetToken,
    });

    return res.status(200).json(
      createMsg({
        type: 'success',
        successMessage: 'Password reset email sent',
      }),
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const reset = async (
  req: Request<{ token: string }, any, Partial<BodyAuth>, any>,
  res: Response,
) => {
  try {
    const { password } = req.body;
    const token = req.params.token;

    if (!token || !password) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need reset token and new password',
        }),
      );
    }

    const resetTokenInDb = await db.resetToken.findFirst({
      where: {
        resetToken: token,
      },
    });
    if (!resetTokenInDb) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Invalid token',
        }),
      );
    }
    const decoded = decodeToken({
      type: 'resetToken',
      token: resetTokenInDb.resetToken,
    });
    if (!decoded) {
      return res.status(401).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Invalid token or expired token',
        }),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Promise.all([
      db.profile.update({
        where: { id: decoded.profileId },
        data: {
          password: hashedPassword,
        },
      }),
      db.resetToken.delete({
        where: {
          id: resetTokenInDb.id,
        },
      }),
    ]);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};
export const refresh = async (req: Request, res: Response) => {
  try {
    // Check if lack of info
    // No refresh token in cookie means unauthentication
    if (!req.cookies.jwt) {
      return res.sendStatus(401);
    }

    // Exist refresh token
    const existRefreshToken = req.cookies.jwt;
    // Delete old cookies
    res.clearCookie('jwt', refreshTokenCookieOptions);

    const refreshTokenInDb = await db.refreshToken.findFirst({
      where: {
        refreshToken: existRefreshToken,
      },
      include: {
        profile: true,
      },
    });
    if (!refreshTokenInDb) {
      // No user have identical refreshToken means Forbidden (Fake JWT)
      // existRefreshToken đã bị dùng lại nhưng nếu hết hạn thì không sao, nếu còn hạn lập tức xoá hết refresh token hiện tại của user
      const decodedExistToken = decodeToken({
        type: 'refreshToken',
        token: existRefreshToken,
      });
      // existRefreshToken fake hoặc hết hạn
      if (!decodedExistToken) {
        return res.sendStatus(403);
      }
      // Nếu refresh vẫn còn hạn tức là đã bị dùng bởi hacker
      // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
      await db.refreshToken.deleteMany({
        where: {
          profileId: decodedExistToken.profileId,
        },
      });
      return res.sendStatus(403);
    }

    // Xóa token cũ trong DB
    await db.refreshToken.delete({
      where: {
        id: refreshTokenInDb.id,
      },
    });

    const decoded = decodeToken({
      type: 'refreshToken',
      token: refreshTokenInDb.refreshToken,
    });
    // Token hết hạn hoặc lỗi
    if (!decoded) {
      return res.sendStatus(403);
    }

    // Còn hạn
    const newAccessToken = genToken({
      type: 'accessToken',
      payload: {
        profileId: refreshTokenInDb.profile.id,
        email: refreshTokenInDb.profile.email,
        imageUrl: refreshTokenInDb.profile.imageUrl,
      },
    });
    const newRefreshToken = genToken({
      type: 'refreshToken',
      payload: {
        profileId: refreshTokenInDb.profile.id,
      },
    });
    await db.refreshToken.create({
      data: {
        profileId: refreshTokenInDb.profile.id,
        refreshToken: newRefreshToken,
      },
    });
    res.cookie('jwt', newRefreshToken, refreshTokenCookieOptions);
    return res.status(200).json({
      accessToken: newAccessToken,
      ...createMsg({
        type: 'success',
        successMessage: 'Refresh successfully',
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};
