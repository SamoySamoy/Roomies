import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessageByMessageId,
  getMessages,
  uploadMessageFile,
} from '@/controllers/messages';
import fileUploader from '@/middlewares/fileUploader';

const messagesRouter = Router();

messagesRouter.get('/', getMessages);
messagesRouter.get('/:messageId', getMessageByMessageId);

messagesRouter.post('/', createMessage);
messagesRouter.post('/upload', fileUploader.single('messageFile'), uploadMessageFile);

messagesRouter.put('/:messageId', updateMessage);
messagesRouter.delete('/:messageId', deleteMessage);

export default messagesRouter;
