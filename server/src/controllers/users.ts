import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/db';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const router: Router = express.Router();

import { addIp } from '../utils/userOps';
import getIp from '../utils/getIp';

// get all user info by id
router.get('/api/users/all/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.profile.findUnique({
      where: { id: id },
      include: {
        servers: true,
        members: true,
        channels: true,
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get user servers info by id
router.get('/api/users/servers/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.profile.findUnique({
      where: { id: id },
      select: {
        servers: true,
      },
    });

    if (user) {
      res.status(200).json(user.servers);
    } else {
      res.status(400).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get user members info by id
router.get('/api/users/members/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.profile.findUnique({
      where: { id: id },
      select: {
        members: true,
      },
    });

    if (user) {
      res.status(200).json(user.members);
    } else {
      res.status(400).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get user channels info by id
router.get('/api/users/channels/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.profile.findUnique({
      where: { id: id },
      select: {
        channels: true,
      },
    });

    if (user) {
      res.status(200).json(user.channels);
    } else {
      res.status(400).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// upload user image
const upload = multer({ dest: 'user_images' });
router.post(
  '/api/users/addImage/:id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      // Get the buffer of the uploaded image
      const imageBuffer = req.file.buffer;

      // Create a unique file name for the resized image
      const newImageDir = path.join(__dirname, 'uploads', `${Date.now()}_resized.jpg`);

      // Resize the image using sharp and save it to the specified path
      await sharp(imageBuffer).resize(82, 82).toFile(newImageDir);

      console.log('new profile image:', newImageDir);

      await prisma.profile.update({
        where: { id: req.params.id },
        data: {
          imageUrl: newImageDir,
        },
      });

      res.status(200).json({ message: 'Add image successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

export default router;
