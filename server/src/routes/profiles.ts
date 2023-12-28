import { Router } from 'express';
import multer from 'multer';
import { getProfileById, uploadProfileImage } from '@/controllers/profiles';

const upload = multer({ dest: 'public/user' });
const profilesRouter = Router();

profilesRouter.get('/:id', getProfileById);
profilesRouter.post('/upload/:id', upload.single('image'), uploadProfileImage);

export default profilesRouter;
