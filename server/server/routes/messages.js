"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var messages_1 = require("../controllers/messages");
var fileUploader_1 = __importDefault(require("../middlewares/fileUploader"));
var messagesRouter = (0, express_1.Router)();
messagesRouter.get('/', messages_1.getMessages);
messagesRouter.get('/:messageId', messages_1.getMessageByMessageId);
messagesRouter.post('/', messages_1.createMessage);
messagesRouter.post('/upload', fileUploader_1.default.single('messageFile'), messages_1.uploadMessageFile);
messagesRouter.put('/:messageId', messages_1.updateMessage);
messagesRouter.delete('/:messageId', messages_1.deleteMessage);
exports.default = messagesRouter;
