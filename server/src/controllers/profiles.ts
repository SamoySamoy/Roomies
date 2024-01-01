import { Request, Response } from 'express';
import { db } from '@/prisma/db';
import { Room, Member, Group } from '@prisma/client';
import sharp from 'sharp';
import { createMsg, uuid } from '@/lib/utils';
import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import bcrypt from 'bcrypt';
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'User not found',
        }),
      );
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Profile not found',
        }),
      );
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

    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: {
        imageUrl: relImagePath,
      },
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const changeProfileImage = async (
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
    });

    if (!profile) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Profile not found',
        }),
      );
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

    if (profile.imageUrl) {
      const existingImagePath = path.join(__dirname, '..', '..', profile.imageUrl);

      if (fs.existsSync(existingImagePath)) {
        await fsPromises.unlink(existingImagePath);
      }
    }

    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: {
        imageUrl: relImagePath,
      },
    });

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const changePassword = async (req: AuthenticatedRequest<any, any, any>, res: Response) => {
  try {
    const profileId = req.user?.profileId!;
    const profile = await db.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Profile not found',
        }),
      );
    }
    const { password } = req.body;

    if (!password) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need new password',
        }),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.profile.update({
      where: { id: profileId },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: 'Change password successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};
