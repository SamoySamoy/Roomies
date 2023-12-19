import jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { addIp, getIp } from '@/lib/utils';
import { db } from '@/prisma/db';
import multer from 'multer';

import sharp from 'sharp';
import path from 'path';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, hashedPassword } = req.body;
    const ip = getIp(req);
    const user = await db.profile.findUnique({
      where: { email: email },
    });

    if (!user) {
      const newUser = await db.profile.create({
        data: {
          email,
          password: hashedPassword,
          ip,
        },
      });

      const user = await db.profile.findUnique({
        where: { email: email },
        include: {
          servers: true,
          members: true,
          channels: true,
        },
      });
      if (user) {
        return res.status(200).json(user);
      }
    } else {
      return res.status(400).json({ error: 'Email already used' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const ip = getIp(req);
    const { email, hashedPassword } = await req.body;
    const user = await db.profile.findUnique({
      where: { email: email },
      include: {
        servers: true,
        members: true,
        channels: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    } else {
      const storedPassword = String(user.password);
      if (hashedPassword === storedPassword) {
        await addIp(email, ip);
        const token = jwt.sign({ email }, 'roomies', { expiresIn: '1h' });
        return res.status(200).json({
          token: token,
          id: user.id,
          email: user.email,
          ip: user.ip,
          imageUrl: user.imageUrl,
          servers: user.servers,
          members: user.members,
          channels: user.channels,
        });
      } else {
        return res.status(400).json({ error: 'Wrong email or password' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response) => {};
