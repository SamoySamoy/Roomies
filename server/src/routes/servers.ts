import { Router } from 'express';
import {
  createServer,
  getServerByServerId,
  getServersByUserId,
  getServers,
  updateServer,
  deleteServer,
  leaveServer,
  joinServer,
} from '@/controllers/servers';
import { authToken } from '@/middlewares/authToken';

const serverRouter = Router();

serverRouter.post('/create', authToken, createServer);
serverRouter.get('/', getServers);
serverRouter.get('/:id', getServerByServerId);
serverRouter.get('/user/:userId', getServersByUserId); // New route for getting servers by userId
serverRouter.put('/:id', authToken, updateServer);
serverRouter.delete('/:id', authToken, deleteServer);
serverRouter.post('join/:id', authToken, joinServer);
serverRouter.post('leave/:id', authToken, leaveServer);

export default serverRouter;
