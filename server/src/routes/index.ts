import { Router } from 'express';

import authRouter from './auth';
import profilesRouter from './profiles';
import roomsRouter from './rooms';
import groupsRouter from './groups';
import verifyToken from '@/middlewares/verifyToken';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
// apiRouter.use('/profiles', profilesRouter);
apiRouter.use('/rooms', verifyToken, roomsRouter);
apiRouter.use('/groups', verifyToken, groupsRouter);

export default apiRouter;
