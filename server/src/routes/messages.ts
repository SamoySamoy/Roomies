import { Router } from 'express';
import { createMessage, deleteMessage, editMessage, getMessageById } from '../controllers/messages';

const messagesRouter = Router();

messagesRouter.post('/', createMessage);
messagesRouter.get('/:messageId', getMessageById);
messagesRouter.delete('/:messageId', deleteMessage);
messagesRouter.put('/:messageId', editMessage);

export default messagesRouter;
