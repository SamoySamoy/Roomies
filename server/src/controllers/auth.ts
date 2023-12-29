import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { addIp, getIp } from '@/lib/utils';
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
