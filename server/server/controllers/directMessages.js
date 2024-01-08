"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDirectMessage = exports.updateDirectMessage = exports.uploadDirectMessageFile = exports.createDirectMessage = exports.getDirectMessageByDirectMessageId = exports.getDirectMessages = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var db_1 = require("../prisma/db");
var utils_1 = require("../lib/utils");
var sharp_1 = __importDefault(require("sharp"));
var constants_1 = require("../lib/constants");
var getDirectMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cursor, conversationId, directMessages, lastCursor, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, cursor = _a.cursor, conversationId = _a.conversationId;
                if (!conversationId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require cursor and conversation id',
                        }))];
                }
                return [4 /*yield*/, db_1.db.directMessage.findMany(__assign(__assign({ where: {
                            conversationId: conversationId,
                        }, take: constants_1.MESSAGES_BATCH }, (cursor && {
                        skip: 1,
                        cursor: {
                            id: cursor,
                        },
                    })), { include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        }, orderBy: {
                            createdAt: 'desc',
                        } }))];
            case 1:
                directMessages = _b.sent();
                lastCursor = null;
                if (directMessages.length === constants_1.MESSAGES_BATCH) {
                    lastCursor = directMessages[constants_1.MESSAGES_BATCH - 1].id;
                }
                return [2 /*return*/, res.status(200).json((0, utils_1.createResult)({
                        type: 'paging:cursor',
                        items: directMessages,
                        lastCursor: lastCursor,
                    }))];
            case 2:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDirectMessages = getDirectMessages;
var getDirectMessageByDirectMessageId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var directMessageId, directMessage, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                directMessageId = req.params.directMessageId;
                return [4 /*yield*/, db_1.db.directMessage.findUnique({
                        where: { id: directMessageId },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 1:
                directMessage = _a.sent();
                if (!directMessage) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Direct Message not found',
                        }))];
                }
                return [2 /*return*/, res.status(200).json(directMessage)];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDirectMessageByDirectMessageId = getDirectMessageByDirectMessageId;
// create new message in channel
var createDirectMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, conversationId, roomId, content, profileId, conversation, currentMember, newDirectMessage, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, conversationId = _a.conversationId, roomId = _a.roomId, content = _a.content;
                profileId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.profileId;
                if (!conversationId || !roomId || !content) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require conversation id, room id, content, missing',
                        }))];
                }
                return [4 /*yield*/, db_1.db.conversation.findFirst({
                        where: {
                            id: conversationId,
                            OR: [
                                {
                                    memberOne: {
                                        profileId: profileId,
                                    },
                                },
                                {
                                    memberTwo: {
                                        profileId: profileId,
                                    },
                                },
                            ],
                        },
                        include: {
                            memberOne: {
                                include: {
                                    profile: true,
                                },
                            },
                            memberTwo: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 1:
                conversation = _c.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Conversation not exist',
                        }))];
                }
                currentMember = void 0;
                if (conversation.memberOne.profileId === profileId) {
                    currentMember = conversation.memberOne;
                }
                if (conversation.memberTwo.profileId === profileId) {
                    currentMember = conversation.memberTwo;
                }
                if (!currentMember) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not create message. You are not member of this conversation',
                        }))];
                }
                newDirectMessage = db_1.db.directMessage.create({
                    data: { content: content, fileUrl: null, memberId: currentMember.id, conversationId: conversationId },
                    include: {
                        member: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
                return [2 /*return*/, res.status(200).json(newDirectMessage)];
            case 2:
                error_3 = _c.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createDirectMessage = createDirectMessage;
// create new message in channel
var uploadDirectMessageFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, conversationId, roomId, profileId, conversation, currentMember, file, relFolderPath, absFolderPath, filename, relFilePath, absFilePath, newDirectMessage, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, conversationId = _a.conversationId, roomId = _a.roomId;
                profileId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.profileId;
                if (!conversationId || !roomId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require conversation id, room id, missing',
                        }))];
                }
                return [4 /*yield*/, db_1.db.conversation.findFirst({
                        where: {
                            id: conversationId,
                            OR: [
                                {
                                    memberOne: {
                                        profileId: profileId,
                                    },
                                },
                                {
                                    memberTwo: {
                                        profileId: profileId,
                                    },
                                },
                            ],
                        },
                        include: {
                            memberOne: {
                                include: {
                                    profile: true,
                                },
                            },
                            memberTwo: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 1:
                conversation = _c.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Conversation not exist',
                        }))];
                }
                currentMember = void 0;
                if (conversation.memberOne.profileId === profileId) {
                    currentMember = conversation.memberOne;
                }
                if (conversation.memberTwo.profileId === profileId) {
                    currentMember = conversation.memberTwo;
                }
                if (!currentMember) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not create message. You are not member of this conversation',
                        }))];
                }
                file = req.file;
                relFolderPath = "/public/conversations/".concat(conversationId);
                absFolderPath = path_1.default.join(__dirname, '..', '..', relFolderPath);
                filename = file.originalname;
                if ((0, utils_1.isImageFile)(filename)) {
                    filename = "".concat((0, utils_1.getFileName)(filename), "_").concat((0, utils_1.uuid)(), ".webp");
                }
                else {
                    filename = "".concat((0, utils_1.getFileName)(filename), "_").concat((0, utils_1.uuid)(), ".").concat((0, utils_1.getExtName)(filename));
                }
                relFilePath = path_1.default.join(relFolderPath, filename);
                absFilePath = path_1.default.join(absFolderPath, filename);
                return [4 /*yield*/, (0, utils_1.mkdirIfNotExist)(absFolderPath)];
            case 2:
                _c.sent();
                if (!(0, utils_1.isImageFile)(filename)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, sharp_1.default)(file.buffer)
                        .resize(constants_1.MESSAGE_FILE_WIDTH, constants_1.MESSAGE_FILE_HEIGHT)
                        .webp()
                        .toFile(absFilePath)];
            case 3:
                _c.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, promises_1.default.writeFile(absFilePath, file.buffer)];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                newDirectMessage = db_1.db.directMessage.create({
                    data: {
                        content: 'This message is a file',
                        fileUrl: relFilePath,
                        memberId: currentMember.id,
                        conversationId: conversationId,
                    },
                    include: {
                        member: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
                return [2 /*return*/, res.status(200).json(newDirectMessage)];
            case 7:
                error_4 = _c.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.uploadDirectMessageFile = uploadDirectMessageFile;
// Update message by messageId
var updateDirectMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var directMessageId, profileId, content, directMessage, owner, updatedDirectMessage, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                directMessageId = req.params.directMessageId;
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                content = req.body.content;
                return [4 /*yield*/, db_1.db.directMessage.findUnique({
                        where: { id: directMessageId },
                    })];
            case 1:
                directMessage = _b.sent();
                if (!directMessage) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Direct message not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.member.findUnique({
                        where: { id: directMessage.memberId },
                    })];
            case 2:
                owner = _b.sent();
                if (!owner) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'The owner of this direct message was not found',
                        }))];
                }
                if (owner.profileId !== profileId) {
                    return [2 /*return*/, res.status(403).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only the author can edit his / her direct message',
                        }))];
                }
                return [4 /*yield*/, db_1.db.directMessage.update({
                        where: {
                            id: directMessageId,
                        },
                        data: {
                            content: content,
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 3:
                updatedDirectMessage = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedDirectMessage)];
            case 4:
                error_5 = _b.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateDirectMessage = updateDirectMessage;
var deleteDirectMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var directMessageId, profileId, directMessage, owner, deletedDirectMessage, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                directMessageId = req.params.directMessageId;
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                return [4 /*yield*/, db_1.db.directMessage.findUnique({
                        where: { id: directMessageId },
                    })];
            case 1:
                directMessage = _b.sent();
                if (!directMessage) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Message not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.member.findUnique({
                        where: { id: directMessage.memberId },
                    })];
            case 2:
                owner = _b.sent();
                if (!owner) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'The owner of this direct message was not found',
                        }))];
                }
                if (owner.profileId !== profileId) {
                    return [2 /*return*/, res.status(403).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only the author can edit his / her direct message',
                        }))];
                }
                return [4 /*yield*/, db_1.db.directMessage.update({
                        where: {
                            id: directMessageId,
                        },
                        data: {
                            fileUrl: null,
                            content: 'This message has been deleted.',
                            deleted: true,
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 3:
                deletedDirectMessage = _b.sent();
                return [2 /*return*/, res.status(200).send(deletedDirectMessage)];
            case 4:
                error_6 = _b.sent();
                console.error(error_6);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteDirectMessage = deleteDirectMessage;
