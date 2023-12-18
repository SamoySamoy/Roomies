import { Router } from 'express';
import multer from 'multer';
import { getUserById, uploadUserImage } from '@/controllers/users';

const upload = multer({ dest: 'public/user' });
const userRouter = Router();

userRouter.get('/:id', getUserById);
userRouter.post('/upload/:id', upload.single('image'), uploadUserImage);

export default userRouter;
