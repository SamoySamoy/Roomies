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
exports.deleteMessage = exports.updateMessage = exports.uploadMessageFile = exports.createMessage = exports.getMessageByMessageId = exports.getMessages = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var db_1 = require("../prisma/db");
var utils_1 = require("../lib/utils");
var sharp_1 = __importDefault(require("sharp"));
var constants_1 = require("../lib/constants");
var getMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cursor, groupId, messages, lastCursor, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, cursor = _a.cursor, groupId = _a.groupId;
                if (!groupId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require cursor and group id',
                        }))];
                }
                return [4 /*yield*/, db_1.db.message.findMany(__assign(__assign({ where: {
                            groupId: groupId,
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
                messages = _b.sent();
                lastCursor = null;
                if (messages.length === constants_1.MESSAGES_BATCH) {
                    lastCursor = messages[constants_1.MESSAGES_BATCH - 1].id;
                }
                return [2 /*return*/, res.status(200).json((0, utils_1.createResult)({
                        type: 'paging:cursor',
                        items: messages,
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
exports.getMessages = getMessages;
// Get message by messageId
var getMessageByMessageId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, message, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                messageId = req.params.messageId;
                return [4 /*yield*/, db_1.db.message.findUnique({
                        where: { id: messageId },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    })];
            case 1:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Message not found',
                        }))];
                }
                return [2 /*return*/, res.status(200).json(message)];
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
exports.getMessageByMessageId = getMessageByMessageId;
// create new message in channel
var createMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupId, roomId, content, profileId, _b, group, member, newMessage, error_3;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.body, groupId = _a.groupId, roomId = _a.roomId, content = _a.content;
                profileId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.profileId;
                if (!groupId || !roomId || !content) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require group id, room id, content, missing',
                        }))];
                }
                return [4 /*yield*/, Promise.all([
                        db_1.db.group.findFirst({
                            where: {
                                id: groupId,
                                roomId: roomId,
                            },
                        }),
                        db_1.db.member.findFirst({
                            where: {
                                profileId: profileId,
                                roomId: roomId,
                            },
                        }),
                    ])];
            case 1:
                _b = _d.sent(), group = _b[0], member = _b[1];
                if (!group) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group not exist',
                        }))];
                }
                if (!member) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not create message. You are not member of this channel',
                        }))];
                }
                newMessage = db_1.db.message.create({
                    data: { content: content, fileUrl: null, memberId: member.id, groupId: groupId },
                    include: {
                        member: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
                return [2 /*return*/, res.status(200).json(newMessage)];
            case 2:
                error_3 = _d.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createMessage = createMessage;
// create new message in channel
var uploadMessageFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupId, roomId, profileId, _b, group, member, file, relFolderPath, absFolderPath, filename, relFilePath, absFilePath, newMessage, error_4;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                _a = req.body, groupId = _a.groupId, roomId = _a.roomId;
                profileId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.profileId;
                if (!groupId || !roomId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require group id, room id, missing',
                        }))];
                }
                return [4 /*yield*/, Promise.all([
                        db_1.db.group.findFirst({
                            where: {
                                id: groupId,
                                roomId: roomId,
                            },
                        }),
                        db_1.db.member.findFirst({
                            where: {
                                profileId: profileId,
                                roomId: roomId,
                            },
                        }),
                    ])];
            case 1:
                _b = _d.sent(), group = _b[0], member = _b[1];
                if (!group) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group not exist',
                        }))];
                }
                if (!member) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not create message. You are not member of this channel',
                        }))];
                }
                file = req.file;
                relFolderPath = "/public/groups/".concat(groupId);
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
                _d.sent();
                if (!(0, utils_1.isImageFile)(filename)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, sharp_1.default)(file.buffer)
                        .resize(constants_1.MESSAGE_FILE_WIDTH, constants_1.MESSAGE_FILE_HEIGHT)
                        .webp()
                        .toFile(absFilePath)];
            case 3:
                _d.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, promises_1.default.writeFile(absFilePath, file.buffer)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                newMessage = db_1.db.message.create({
                    data: {
                        content: 'This message is a file',
                        fileUrl: relFilePath,
                        memberId: member.id,
                        groupId: group.id,
                    },
                    include: {
                        member: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
                return [2 /*return*/, res.status(200).json(newMessage)];
            case 7:
                error_4 = _d.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.uploadMessageFile = uploadMessageFile;
// Update message by messageId
var updateMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, profileId, content, message, owner, updatedMessage, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                messageId = req.params.messageId;
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                content = req.body.content;
                return [4 /*yield*/, db_1.db.message.findUnique({
                        where: { id: messageId },
                    })];
            case 1:
                message = _b.sent();
                if (!message) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Message not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.member.findUnique({
                        where: { id: message.memberId },
                    })];
            case 2:
                owner = _b.sent();
                if (!owner) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'The owner of this message was not found',
                        }))];
                }
                if (owner.profileId !== profileId) {
                    return [2 /*return*/, res.status(403).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only the author can edit his / her message',
                        }))];
                }
                return [4 /*yield*/, db_1.db.message.update({
                        where: {
                            id: messageId,
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
                updatedMessage = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedMessage)];
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
exports.updateMessage = updateMessage;
// Delete message by messageId
var deleteMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, profileId, message, owner, deletedMessage, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                messageId = req.params.messageId;
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                return [4 /*yield*/, db_1.db.message.findUnique({
                        where: { id: messageId },
                    })];
            case 1:
                message = _b.sent();
                if (!message) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Message not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.member.findUnique({
                        where: { id: message.memberId },
                    })];
            case 2:
                owner = _b.sent();
                if (!owner) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'The owner of this message was not found',
                        }))];
                }
                if (owner.profileId !== profileId) {
                    return [2 /*return*/, res.status(403).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only the author can edit his / her message',
                        }))];
                }
                return [4 /*yield*/, db_1.db.message.update({
                        where: {
                            id: messageId,
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
                deletedMessage = _b.sent();
                return [2 /*return*/, res.status(200).send(deletedMessage)];
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
exports.deleteMessage = deleteMessage;
