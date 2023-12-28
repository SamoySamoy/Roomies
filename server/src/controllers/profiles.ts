import { Request, Response } from 'express';
import { db } from '@/prisma/db';
import { Server, Member, Channel } from '@prisma/client';
import sharp from 'sharp';

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { all, servers, members, channels } = req.query;

    const user = await db.profile.findUnique({
      where: { id: id },
      include: {
        servers: true,
        members: true,
        channels: true,
      },
    });

    const returnData: {
      servers?: Server[];
      members?: Member[];
      channels?: Channel[];
    } = {};

    if (user) {
      if (all) {
        return res.status(200).json(user);
      } else {
        if (servers) {
          returnData.servers = user.servers;
        }
        if (members) {
          returnData.members = user.members;
        }
        if (channels) {
          returnData.channels = user.channels;
        }
        return res.status(200).json(returnData);
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
