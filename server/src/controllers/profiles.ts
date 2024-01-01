import { Response } from 'express';
import { db } from '@/prisma/db';
import sharp from 'sharp';
import {
  createMsg,
  getFileName,
  isTruthy,
  mkdirIfNotExist,
  removeIfExist,
  uuid,
} from '@/lib/utils';
import path from 'path';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '@/lib/types';

type ParamsProfileId = {
  profileId: string;
};

type QueryInclude = {
  rooms: string;
  members: string;
  groups: string;
};

export const getProfileByProfileId = async (
  req: AuthenticatedRequest<ParamsProfileId, any, Partial<QueryInclude>>,
  res: Response,
) => {
  try {
    const { profileId } = req.params;
    const { rooms, members, groups } = req.query;

    const profile = await db.profile.findUnique({
      where: { id: profileId },
      include: {
        rooms: isTruthy(rooms),
        members: isTruthy(members),
        groups: isTruthy(groups),
      },
    });
    if (!profile) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Profile not found',
        }),
      );
    }

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

export const uploadProfileImage = async (
  req: AuthenticatedRequest<any, any, any>,
  res: Response,
) => {
  try {
    const profileId = req.user?.profileId;

    if (!req.file) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require profile image',
        }),
      );
    }

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
    const imageName = `${getFileName(image.originalname)}_${uuid()}.webp`;
    const relFolderPath = '/public/users';
    const absFolderPath = path.join(__dirname, '..', '..', relFolderPath);
    const relImagePath = path.join(relFolderPath, imageName);
    const absImagePath = path.join(absFolderPath, imageName);

    await mkdirIfNotExist(absFolderPath);
    await sharp(image.buffer).resize(300, 300).webp().toFile(absImagePath);
    if (profile.imageUrl) {
      const oldImagePath = path.join(absFolderPath, profile.imageUrl);
      removeIfExist(oldImagePath);
    }

    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: {
        imageUrl: relImagePath,
      },
      select: {
        email: true,
        imageUrl: true,
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

export const deleteProfileImage = async (
  req: AuthenticatedRequest<any, any, any>,
  res: Response,
) => {
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

    if (profile.imageUrl) {
      const oldImagePath = path.join(__dirname, '..', '..', profile.imageUrl);
      removeIfExist(oldImagePath);
    }

    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: {
        imageUrl: null,
      },
      select: {
        email: true,
        imageUrl: true,
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

export type BodyChangePassword = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (
  req: AuthenticatedRequest<any, Partial<BodyChangePassword>, any>,
  res: Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const profileId = req.user?.profileId!;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Need current password and new password',
        }),
      );
    }

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

    const isRightCurrentPassword = await bcrypt.compare(currentPassword, profile.password);
    if (!isRightCurrentPassword) {
      return res.status(401).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Unauthentication',
        }),
      );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await db.profile.update({
      where: { id: profileId },
      data: {
        password: newHashedPassword,
      },
    });

    return res.status(200).json(
      createMsg({
        type: 'success',
        successMessage: 'Change password successfully',
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
