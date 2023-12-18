import express, { Request, Response, Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../utils/authentication';
import { db } from '../prisma/db';
import { MemberRole, ServerType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

// get server by user id:

// Create new server
router.post(
  '/api/servers/create',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, imageUrl, type } = req.body;

      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await db.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      if (!profile) {
        return res.status(400).json({ error: 'User email not found in token' });
      } else {
        const newServer = await db.server.create({
          data: {
            profileId: profile.id,
            name,
            type,
            imageUrl,
            inviteCode: uuidv4(),
            channels: {
              create: [{ name: 'general', profileId: profile.id }],
            },
            members: {
              create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
            },
          },
        });

        const server = await db.server.findUnique({
          where: { id: newServer.id },
          include: {
            members: true,
            channels: true,
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

// Get all servers by type and userId
router.get('/api/servers', async (req: Request, res: Response) => {
  try {
    const { type, profileId } = req.body;
    const filter: {
      type?: ServerType;
      profileId?: string;
    } = {};

    if (type) {
      filter.type = type;
    }

    if (profileId) {
      filter.profileId = profileId;
    }

    const servers = await db.server.findMany({
      where: filter,
      include: {
        members: true,
        channels: true,
      },
    });
    res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific server info by serverID (all)
router.get('/api/servers/all/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
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

// Get a specific server info by serverID (members)
router.get('/api/servers/members/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    res.status(200).json(server.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific server info by serverID (channels)
router.get('/api/servers/channels/:id', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    res.status(200).json(server.channels);
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
      const { name, imageUrl, type } = req.body;
      const updatedServerData: {
        name?: string;
        imageUrl?: string;
        type?: ServerType;
      } = {};

      if (name !== undefined) {
        updatedServerData.name = name;
      }

      if (imageUrl !== undefined) {
        updatedServerData.imageUrl = imageUrl;
      }

      if (type !== undefined) {
        updatedServerData.type = type;
      }

      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await db.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      const serverId = req.params.id;
      const server = await db.server.findUnique({
        where: { id: serverId, profileId: profile?.id },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found or you are not admin of this server' });
        return;
      }

      const updatedServer = await db.server.update({
        where: {
          id: serverId,
        },
        data: updatedServerData,
      });

      const returnServer = await db.server.findUnique({
        where: { id: serverId },
        include: {
          members: true,
          channels: true,
        },
      });

      res.status(200).json(returnServer);
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
      const profile = await db.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      const serverId = req.params.id;
      const server = await db.server.findUnique({
        where: { id: serverId, profileId: profile?.id },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found or you are not admin of this server' });
        return;
      }
      await db.server.delete({
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

// Leave server
router.post(
  '/api/servers/leave/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await db.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      const serverId = req.params.id;
      const server = await db.server.findUnique({
        where: {
          id: serverId,
          profileId: {
            not: profile?.id,
          },
          members: {
            some: {
              profileId: profile?.id,
            },
          },
        },
        include: {
          members: true,
          channels: true,
        },
      });
      if (!server) {
        return res.status(400).json({
          error:
            'You can not leave this server (you are the admin or you are not member of this server)',
        });
      }
      const updateServer = await db.server.update({
        where: {
          id: serverId,
          profileId: {
            not: profile?.id,
          },
          members: {
            some: {
              profileId: profile?.id,
            },
          },
        },
        data: {
          members: {
            deleteMany: {
              profileId: profile?.id,
            },
          },
        },
      });
      const returnServer = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          members: true,
          channels: true,
        },
      });
      res.status(200).json(returnServer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// join server
router.post(
  '/api/servers/join/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: 'User email not found in token' });
      }
      const profile = await db.profile.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      if (!profile) {
        return res.status(400).json({ error: 'You are unauthenticated' });
      }

      const serverId = req.params.id;
      const { inviteCode } = req.body;
      const existingServer = await db.server.findFirst({
        where: {
          inviteCode: inviteCode,
          members: {
            some: {
              profileId: profile?.id,
            },
          },
        },
      });

      if (existingServer) {
        return res.status(400).json({ error: 'You already in this server' });
      }

      const updateServer = await db.server.update({
        where: {
          inviteCode: inviteCode,
        },
        data: {
          members: {
            create: [
              {
                profileId: profile.id,
              },
            ],
          },
        },
      });
      const returnServer = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          members: true,
          channels: true,
        },
      });
      res.status(200).json(returnServer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

export default router;
