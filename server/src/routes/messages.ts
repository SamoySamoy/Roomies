import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessageById,
  getMessages,
  uploadFile,
} from '@/controllers/messages';
import fileUploader from '@/middlewares/fileUploader';

const messagesRouter = Router();

messagesRouter.get('/', getMessages);
messagesRouter.get('/:messageId', getMessageById);

messagesRouter.post('/', createMessage);
messagesRouter.post('/upload', fileUploader.single('messageFile'), uploadFile);

messagesRouter.put('/:messageId', updateMessage);
messagesRouter.delete('/:messageId', deleteMessage);

export default messagesRouter;
