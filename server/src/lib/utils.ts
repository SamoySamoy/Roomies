import { Request } from 'express';
import { db } from '../prisma/db';

export const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();

export const addIp = async (email: string, ip: string | undefined): Promise<void> => {
  try {
    const updatedProfile = await db.profile.update({
      where: { email },
      data: { ip },
    });

    console.log(`ip ${ip} added...`);
  } catch (err) {
    console.error(err);
  }
};
