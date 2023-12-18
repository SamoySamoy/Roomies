import { Router } from 'express';

import authRouter from './auth';
import userRouter from './users';
import serverRouter from './servers';
import channelRouter from './channels';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/servers', serverRouter);
apiRouter.use('/channels', channelRouter);

export default apiRouter;
