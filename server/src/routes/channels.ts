import { Router } from 'express';
import { authToken } from '@/middlewares/authToken';

import {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
} from '@/controllers/channels';
const channelRouter = Router();

channelRouter.post('/create', authToken, createChannel);
channelRouter.get('/:id', getChannelById);
channelRouter.put('/:id', authToken, updateChannel);
channelRouter.delete('/:id', authToken, deleteChannel);

export default channelRouter;
