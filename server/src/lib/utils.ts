import { Request } from 'express';
import { Profile, ServerType } from '@prisma/client';
import { db } from '../prisma/db';
import { UUID, randomUUID } from 'node:crypto';

export const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();

export const addIp = async (email: string, ip: string | undefined): Promise<Profile | null> => {
  try {
    const updatedProfile = await db.profile.update({
      where: { email },
      data: { ip },
    });
    return updatedProfile;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const uuid: () => string | UUID = randomUUID;

const TRUTHY = [1, true, '1', 'true'];
export const isTruthy = (value: any) => TRUTHY.includes(value);

export const convertMbToBytes = (mb: number) => mb * Math.pow(1024, 2);
