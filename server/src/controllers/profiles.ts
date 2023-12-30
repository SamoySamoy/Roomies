import { Request, Response } from 'express';
import { db } from '@/prisma/db';
import { Room, Member, Group } from '@prisma/client';
import sharp from 'sharp';
import { createMsg } from '@/lib/utils';

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

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Get the buffer of the uploaded image
    const imageBuffer = req.file.buffer;

    // Resize the image using sharp and let multer handle the storage
    await sharp(imageBuffer).resize(100, 100).toFile(req.file.path);

    await db.profile.update({
      where: { id: req.params.id },
      data: {
        imageUrl: req.file.path,
      },
    });

    return res.status(200).json({ message: 'Add image successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};
