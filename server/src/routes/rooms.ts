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
import fileUploader from '@/middlewares/fileUploader';

const roomsRouter = Router();

roomsRouter.get('/', getRooms);
roomsRouter.get('/:roomId', getRoomByRoomId);

roomsRouter.post('/', fileUploader.single('roomImage'), createRoom);
roomsRouter.post('/join/:roomId', joinRoom);
roomsRouter.post('/join/invite/:inviteCode', joinRoomByInviteCode);
roomsRouter.post('/leave/:roomId', leaveRoom);

roomsRouter.put('/:roomId', fileUploader.any(), updateRoom);
roomsRouter.delete('/:roomId', deleteRoom);

export default roomsRouter;
