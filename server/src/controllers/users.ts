import express, { Request, Response, Router } from 'express';
import { db } from '../prisma/db';
import sharp from 'sharp';
import { Server, Member, Channel } from '@prisma/client';

// get user by userId
export const getUserById = async (req: Request, res: Response) => {
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
      return res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// upload user image
export const uploadUserImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Get the buffer of the uploaded image
    const imageBuffer = req.file.buffer;

    // Resize the image using sharp and let multer handle the storage
    await sharp(imageBuffer).resize(82, 82).toFile(req.file.path);

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
