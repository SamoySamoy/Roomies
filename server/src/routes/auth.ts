import { Router } from 'express';
import { register, login, logout, forgot, reset, refresh } from '../controllers/auth';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgot', forgot);
authRouter.post('/reset', reset);
authRouter.post('/refresh', refresh);

export default authRouter;
