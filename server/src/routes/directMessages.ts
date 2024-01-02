import { Router } from 'express';
import {
  createDirectMessage,
  deleteDirectMessage,
  updateDirectMessage,
  getDirectMessageByDirectMessageId,
  getDirectMessages,
  uploadDirectMessageFile,
} from '@/controllers/directMessages';
import fileUploader from '@/middlewares/fileUploader';

const directMessagesRouter = Router();

directMessagesRouter.get('/', getDirectMessages);
directMessagesRouter.get('/:directMessageId', getDirectMessageByDirectMessageId);

directMessagesRouter.post('/', createDirectMessage);
directMessagesRouter.post(
  '/upload',
  fileUploader.single('directMessageFile'),
  uploadDirectMessageFile,
);

directMessagesRouter.put('/:directMessageId', updateDirectMessage);
directMessagesRouter.delete('/:directMessageId', deleteDirectMessage);

export default directMessagesRouter;
