import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

// get all user info by id
// api/users
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await db.profile.findUnique({
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
};

// api/users/:id?all=true
// getUserById

// get user servers info by id
'/api/users/servers/:id',
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await db.profile.findUnique({
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
  };

// get user members info by id
get('/api/users/members/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await db.profile.findUnique({
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
get('/api/users/channels/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await db.profile.findUnique({
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
post('/api/users/imge/:id', upload.single('image'), async (req: Request, res: Response) => {
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

    console.log('new profile image:', req.body.user, newImageDir);

    await db.profile.update({
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
});

export default router;
