import express, { Request, Response, Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../utils/authentication';
import { prisma } from '../prisma/db';
import { MemberRole } from '@prisma/client';

const router: Router = express.Router();

// Create new server
router.post(
  '/api/servers/create',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await prisma.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      const { name, imageUrl, type } = req.body;

      if (!profile) {
        return res.status(400).json({ error: 'User email not found in token' });
      } else {
        const server = await prisma.server.create({
          data: {
            profileId: profile.id,
            name,
            type,
            imageUrl,
            channels: {
              create: [{ name: 'general', profileId: profile.id }],
            },
            members: {
              create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
            },
          },
        });
        res.status(200).json(server);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Get all servers
router.get('/api/servers', async (req: Request, res: Response) => {
  try {
    const servers = await prisma.server.findMany();
    res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific server by ID
router.get('/api/servers/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    res.status(200).json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a server by ID
router.put(
  '/api/servers/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await prisma.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      
     
      const serverId = req.params.id;
      const server = await prisma.server.findUnique({
        where: { id: serverId, profileId: profile?.id },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found or you are not admin of this server' });
        return;
      }
      const { name, imageUrl, type } = req.body;

      const updatedServer = await prisma.server.update({
        where: {
          id: serverId,
        },
        data: {
          name,
          imageUrl,
          type
        },
      });

      res.status(200).json(updatedServer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Delete a server by ID
router.delete(
  '/api/servers/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await prisma.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      const serverId = req.params.id;
      const server = await prisma.server.findUnique({
        where: { id: serverId, profileId: profile?.id },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found or you are not admin of this server' });
        return;
      }
      await prisma.server.delete({
        where: {
          id: serverId,
        },
      });

      res.status(202).send({ message: 'Server deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

export default router;
