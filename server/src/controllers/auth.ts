import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { addIp, getIp, sendPasswordResetEmail } from '@/lib/utils';
import { db } from '@/prisma/db';
import { AccessTokenPayload, AuthenticatedRequest } from '@/lib/types';

type BodyAuth = {
  email: string;
  password: string;
};

type RequestWithAuthBody = Request<any, any, Partial<BodyAuth>, any>;

export const register = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Need email and password',
      });
    }

    const profile = await db.profile.findUnique({
      where: { email },
    });

    if (profile) {
      return res.status(400).json({ message: 'Email already used' });
    }

    const ip = getIp(req);
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newProfile = await db.profile.create({
      data: {
        email,
        password: hashedPassword,
        ip,
      },
    });
    return res.status(200).json(newProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Need email and password',
      });
    }

    const profile = await db.profile.findUnique({
      where: { email },
    });

    if (!profile) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isRightPassword = await bcrypt.compare(password, profile.password);
    if (!isRightPassword) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }

    const accessToken = jwt.sign(
      {
        profileId: profile.id,
      } satisfies AccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '1h',
      },
    );
    const ip = getIp(req);
    const updatedProfile = await addIp(email, ip);
    // TODO: Add Access and request token for profile
    return res.status(200).json({
      accessToken,
      message: `Login successfully!`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  return res.sendStatus(204);

  const profileId = req.user?.profileId!;
  const updatedProfile = await db.profile.update({
    where: { id: profileId },
    data: { ip: '' },
  });
  return res.status(200).json(updatedProfile);
};

export const forgotPassword = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: 'Email missing' });
    }
    const profile = await db.profile.findUnique({
      where: { email: email },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign(
      {
        profileId: profile.id,
      } satisfies AccessTokenPayload,
      process.env.RESET_TOKEN_SECRET as string,
      {
        expiresIn: '20m',
      },
    );

    await db.resetToken.create({
      data: {
        profileId: profile.id,
        token: resetToken,
      },
    });

    sendPasswordResetEmail(profile.email, resetToken);
    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resetPassword = async (req: RequestWithAuthBody, res: Response) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
  
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET as string) as {
      profileId: string;
    };
    const profileId = decodedToken.profileId;

    const storedToken = await db.resetToken.findFirst({
      where: {
        profileId,
        token,
      },
    });

    if (!storedToken) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    if (!password) {
      return res.status(404).json({ message: 'Missing new password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.profile.update({
      where: { id: profileId },
      data: {
        password: hashedPassword,
      },
    });

    await db.resetToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
