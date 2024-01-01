import { Router } from 'express';
import { register, login, logout, forgot, reset, refresh } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/forgot', forgot);
authRouter.post('/reset/:token', reset);

authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);

export default authRouter;
