import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessageById,
  getMessages,
} from '@/controllers/messages';

const messagesRouter = Router();

messagesRouter.get('/', getMessages);
messagesRouter.get('/:messageId', getMessageById);

messagesRouter.post('/', createMessage);

messagesRouter.put('/:messageId', editMessage);
messagesRouter.delete('/:messageId', deleteMessage);

export default messagesRouter;
