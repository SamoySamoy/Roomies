import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgot', forgotPassword)
authRouter.post('/reset', resetPassword);


export default authRouter;
