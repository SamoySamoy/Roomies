import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/db';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const router: Router = express.Router();

import { addIp } from '../utils/userOps';
import getIp from '../utils/getIp';

// register user
router.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const { email, hashedPassword } = req.body;
    const ip = getIp(req);
    const user = await prisma.profile.findUnique({
      where: { email: email },
    });

    if (!user) {
      const newUser = await prisma.profile.create({
        data: {
          email,
          password: hashedPassword,
          ip,
        },
      });

      const user = await prisma.profile.findUnique({
        where: { email: email },
        include: {
          servers: true,
          members: true,
          channels: true,
        },
      });
      if (user) {
        res.status(200).json(user);
      }
    } else {
      res.status(400).json({ error: 'Email already used' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// login user
router.post('/api/users/login', async (req: Request, res: Response) => {
  try {
    const ip = getIp(req);
    const { email, hashedPassword } = await req.body;
    const user = await prisma.profile.findUnique({
      where: { email: email },
      include: {
        servers: true,
        members: true,
        channels: true,
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Email not found' });
    } else {
      const storedPassword = String(user.password);
      if (hashedPassword === storedPassword) {
        await addIp(email, ip);
        const token = jwt.sign({ email }, 'roomies', { expiresIn: '1h' });
        res.status(200).json({
          token: token,
          id: user.id,
          email: user.email,
          ip: user.ip,
          imageUrl: user.imageUrl,
          servers: user.servers,
          members: user.members,
          channels: user.channels,
        });
      } else {
        res.status(400).json({ error: 'Wrong email or password' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
const upload = multer({ dest: "user_images" });
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

      console.log('new profile image:', req.body.user, newImageDir);

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
