import { Request, Response } from 'express';
import { db } from '@/prisma/db';
import { Room, Member, Group } from '@prisma/client';
import sharp from 'sharp';
import { createMsg, uuid } from '@/lib/utils';
import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { AuthenticatedRequest } from '@/lib/types';

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { all, rooms, members, groups } = req.query;

    const user = await db.profile.findUnique({
      where: { id: id },
      include: {
        rooms: true,
        members: true,
        groups: true,
      },
    });

    const returnData: {
      rooms?: Room[];
      members?: Member[];
      groups?: Group[];
    } = {};

    if (user) {
      if (all) {
        return res.status(200).json(user);
      } else {
        if (rooms) {
          returnData.rooms = user.rooms;
        }
        if (members) {
          returnData.members = user.members;
        }
        if (groups) {
          returnData.groups = user.groups;
        }
        return res.status(200).json(returnData);
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const uploadProfileImage = async (
  req: AuthenticatedRequest<any, any, any>,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Require profile image' });
    }
    const profileId = req.user?.profileId!;
    const profile = await db.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    });
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }

    const image = req.file;
    const folderPath = '/public/user';
    const imageName = `${uuid()}.webp`;
    const relImagePath = path.join(folderPath, imageName);
    const absImageFolderPath = path.join(__dirname, '..', '..', folderPath);
    if (!fs.existsSync(absImageFolderPath)) {
      await fsPromises.mkdir(absImageFolderPath, {
        recursive: true,
      });
    }
    await sharp(image.buffer)
      .resize(300, 300)
      .webp()
      .toFile(path.join(absImageFolderPath, imageName));

    await db.profile.update({
      where: { id: profileId },
      data: {
        imageUrl: relImagePath,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};
