"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var rooms_1 = require("../controllers/rooms");
var fileUploader_1 = __importDefault(require("../middlewares/fileUploader"));
var roomsRouter = (0, express_1.Router)();
roomsRouter.get('/', rooms_1.getRooms);
roomsRouter.get('/:roomId', rooms_1.getRoomByRoomId);
roomsRouter.post('/', fileUploader_1.default.single('roomImage'), rooms_1.createRoom);
roomsRouter.post('/join/:roomId', rooms_1.joinRoom);
roomsRouter.post('/join/invite/:inviteCode', rooms_1.joinRoomByInviteCode);
roomsRouter.post('/leave/:roomId', rooms_1.leaveRoom);
roomsRouter.put('/:roomId', fileUploader_1.default.any(), rooms_1.updateRoom);
roomsRouter.delete('/:roomId', rooms_1.deleteRoom);
exports.default = roomsRouter;
