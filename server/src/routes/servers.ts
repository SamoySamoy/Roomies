import { Router } from 'express';
import {
  createServer,
  getServerByServerId,
  getServers,
  updateServer,
  deleteServer,
  leaveServer,
  joinServer,
  joinServerByInviteCode,
} from '@/controllers/servers';
import multer from 'multer';
import { convertMbToBytes } from '@/lib/utils';

const serverRouter = Router();

const IMAGE_SIZE_LIMIT_IN_MB = 5;
const imageUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype.split('/')[0] !== 'image') {
      return callback(null, false);
    }
    return callback(null, true);
  },
  limits: {
    fileSize: convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB),
  },
});

serverRouter.get('/', getServers);
serverRouter.get('/:serverId');
getServerByServerId;
serverRouter.post('/', imageUploader.single('serverImage'), createServer);
serverRouter.post('/join/:serverId', joinServer);
serverRouter.post('/join/invite/:inviteCode', joinServerByInviteCode);
serverRouter.post('/leave/:serverId', leaveServer);

serverRouter.put('/:serverId', imageUploader.any(), updateServer);
serverRouter.delete('/:serverId', deleteServer);

export default serverRouter;
