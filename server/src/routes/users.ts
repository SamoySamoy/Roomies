import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/db';

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


export default router;
