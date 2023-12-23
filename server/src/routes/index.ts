import { Router } from 'express';

import authRouter from './auth';
import userRouter from './users';
import serverRouter from './servers';
import channelRouter from './channels';
import verifyToken from '@/middlewares/verifyToken';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/servers', verifyToken, serverRouter);
apiRouter.use('/channels', verifyToken, channelRouter);

export default apiRouter;
