"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var conversations_1 = require("../controllers/conversations");
var conversationsRouter = (0, express_1.Router)();
conversationsRouter.get('/', conversations_1.getConversation);
conversationsRouter.post('/', conversations_1.createConversation);
exports.default = conversationsRouter;
