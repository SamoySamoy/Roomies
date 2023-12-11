import express, { Request, Response, Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../utils/authentication';
import { prisma } from '../prisma/db';
import { MemberRole } from '@prisma/client';

const router: Router = express.Router();

// Create a new server
router.post(
  '/api/servers/create',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const {name, imageUrl} = req.body;
      const profile = await prisma.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      if (!profile) {
        return res.status(400).json({ error: 'User email not found in token' });
      } else {
        const server = await prisma.server.create({
          data: {
            profileId: profile.id,
            name,
            imageUrl,
            channels: {
              create: [{ name: 'general', profileId: profile.id }],
            },
            members: {
              create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
            },
          },
        });
        res.send(server)
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Get all servers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const servers = await prisma.server.findMany();
    res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific server by ID
router.get('/:id', async (req: Request, res: Response) => {
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const { name, imageUrl } = req.body;

    const updatedServer = await prisma.server.update({
      where: { id: serverId },
      data: {
        name,
        imageUrl,
      },
    });

    res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a server by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;

    await prisma.server.delete({
      where: { id: serverId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
