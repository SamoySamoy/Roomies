import { Router } from 'express';
import {
  createRoom,
  getRoomByRoomId,
  getRooms,
  updateRoom,
  deleteRoom,
  leaveRoom,
  joinRoom,
  joinRoomByInviteCode,
} from '@/controllers/rooms';
import multer from 'multer';
import { convertMbToBytes } from '@/lib/utils';

const roomsRouter = Router();

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

roomsRouter.get('/', getRooms);
roomsRouter.get('/:roomId', getRoomByRoomId);

roomsRouter.post('/', imageUploader.single('roomImage'), createRoom);
roomsRouter.post('/join/:roomId', joinRoom);
roomsRouter.post('/join/invite/:inviteCode', joinRoomByInviteCode);
roomsRouter.post('/leave/:roomId', leaveRoom);

roomsRouter.put('/:roomId', imageUploader.any(), updateRoom);
roomsRouter.delete('/:roomId', deleteRoom);

export default roomsRouter;
