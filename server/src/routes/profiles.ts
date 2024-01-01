import { Router } from 'express';
import {
  getProfileByProfileId,
  uploadProfileImage,
  deleteProfileImage,
  changePassword,
} from '@/controllers/profiles';
import fileUploader from '@/middlewares/fileUploader';

const profilesRouter = Router();

profilesRouter.get('/:profileId', getProfileByProfileId);

profilesRouter.put('/changePassword', changePassword);
profilesRouter.put('/image', fileUploader.single('profileImage'), uploadProfileImage);
profilesRouter.delete('/image', deleteProfileImage);

export default profilesRouter;
