import { Router } from 'express';

import {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
  getChannels,
} from '@/controllers/channels';
const channelRouter = Router();

channelRouter.get('/', getChannels);
channelRouter.get('/:channelId', getChannelById);

channelRouter.post('/', createChannel);

channelRouter.put('/:channelId', updateChannel);

channelRouter.delete('/:channelId', deleteChannel);

export default channelRouter;
