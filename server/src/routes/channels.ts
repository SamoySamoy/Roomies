import express, { Request, Response, Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../utils/authentication';
import { prisma } from '../prisma/db';
import { MemberRole } from '@prisma/client';
import { ChannelType } from '@prisma/client';

const router: Router = express.Router();

// create new channel
router.post(
  '/api/channels/create',
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
      const { name, serverId, type } = req.body;
      if (!serverId) {
        return res.status(400).json({ error: 'Server Id not missing' });
      }

      if (name === 'general') {
        return res.status(400).json({ error: 'Name can not be general' });
      }

      const server = await prisma.server.findUnique({
        where: { id: serverId, profileId: profile?.id },
      });

      if (!server) {
        return res
          .status(400)
          .json({ error: 'Server not found or you are not admin of this server' });
      }
      const existingChannel = await prisma.channel.findFirst({
        where: {
          serverId,
          name,
        },
      });

      if (existingChannel) {
        return res
          .status(400)
          .json({ error: 'Channel with the same name already exists in the server' });
      }
      if (!profile) {
        return res.status(400).json({ error: 'User email not found in token' });
      } else {
        const server = await prisma.server.update({
          where: {
            id: serverId,
            members: {
              some: {
                profileId: profile?.id,
                role: {
                  in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                },
              },
            },
          },
          data: {
            channels: {
              create: {
                profileId: profile.id,
                name,
                type,
              },
            },
          },
        });
        const createdChannel = await prisma.channel.findFirst({
          where: {
            serverId: server.id,
            profileId: profile.id,
            name,
            type,
          },
        });
        res.status(200).json(createdChannel);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

// Get all channels for a server
router.get('/api/channels/server/:serverId', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.serverId;
    const channels = await prisma.channel.findMany({
      where: {
        serverId,
      },
    });

    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific channel by channel ID
router.get('/api/channels/:id', async (req: Request, res: Response) => {
    try {
      const channelId = req.params.id;
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
      });
  
      if (!channel) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }
  
      res.status(200).json(channel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Update a channel
router.put(
  '/api/channels/:channelId',
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

      const channelId = req.params.channelId;
      const { name } = req.body;

      const channel = await prisma.channel.findUnique({
        where: {
          id: channelId,
          profileId: profile?.id,
        },
      });

      if (!channel) {
        res.status(404).json({ error: 'Channel not found or you are not admin of this server' });
        return;
      }

      const updatedChannel = await prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name,
        },
      });

      res.status(202).json(updatedChannel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// Delete a channel
router.delete(
  '/api/channels/:channelId',
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
      const channelId = req.params.channelId;

      const channel = await prisma.channel.findUnique({
        where: {
          id: channelId,
          profileId: profile?.id,
        },
      });

      if (!channel) {
        res.status(404).json({ error: 'Channel not found or you are not admin of this server' });
        return;
      }
      await prisma.channel.delete({
        where: {
          id: channelId,
        },
      });

      res.status(202).json({ message: 'Channel deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

export default router;
