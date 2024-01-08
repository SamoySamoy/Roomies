"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var directMessages_1 = require("../controllers/directMessages");
var fileUploader_1 = __importDefault(require("../middlewares/fileUploader"));
var directMessagesRouter = (0, express_1.Router)();
directMessagesRouter.get('/', directMessages_1.getDirectMessages);
directMessagesRouter.get('/:directMessageId', directMessages_1.getDirectMessageByDirectMessageId);
directMessagesRouter.post('/', directMessages_1.createDirectMessage);
directMessagesRouter.post('/upload', fileUploader_1.default.single('directMessageFile'), directMessages_1.uploadDirectMessageFile);
directMessagesRouter.put('/:directMessageId', directMessages_1.updateDirectMessage);
directMessagesRouter.delete('/:directMessageId', directMessages_1.deleteDirectMessage);
exports.default = directMessagesRouter;
