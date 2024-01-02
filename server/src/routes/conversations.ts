import { Router } from 'express';

import { createConversation, getConversation } from '@/controllers/conversations';
const conversationsRouter = Router();

conversationsRouter.get('/', getConversation);

conversationsRouter.post('/', createConversation);

export default conversationsRouter;
