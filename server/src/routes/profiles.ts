import { Router } from 'express';
import multer from 'multer';
import { getProfileById, uploadProfileImage, changeProfileImage, changePassword } from '@/controllers/profiles';

const upload = multer({ dest: 'public/user' });
const profilesRouter = Router();

profilesRouter.get('/:id', getProfileById);
profilesRouter.post('/upload', upload.single('image'), uploadProfileImage);
profilesRouter.put('/upload', upload.single('image'), changeProfileImage);
profilesRouter.get('/:id', getProfileById);
profilesRouter.post('/changePassword', changePassword);


export default profilesRouter;
