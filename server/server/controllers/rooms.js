"use strict";
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
exports.deleteRoom = exports.updateRoom = exports.leaveRoom = exports.joinRoomByInviteCode = exports.joinRoom = exports.createRoom = exports.getRoomByRoomId = exports.getRooms = void 0;
var db_1 = require("../prisma/db");
var client_1 = require("@prisma/client");
var utils_1 = require("../lib/utils");
var bcrypt_1 = __importDefault(require("bcrypt"));
var sharp_1 = __importDefault(require("sharp"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("../lib/constants");
// Get all servers
var getRooms = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, profile, members, profilesOfMembers, groups, _b, status_1, _c, roomType, profileId, roomFilterListMap, statusFilterMap, rooms, error_1;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, profile = _a.profile, members = _a.members, profilesOfMembers = _a.profilesOfMembers, groups = _a.groups, _b = _a.status, status_1 = _b === void 0 ? 'joined' : _b, _c = _a.roomType, roomType = _c === void 0 ? 'all' : _c;
                profileId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.profileId;
                roomFilterListMap = {
                    PUBLIC: [client_1.RoomType.PUBLIC],
                    PRIVATE: [client_1.RoomType.PRIVATE],
                    HIDDEN: [client_1.RoomType.HIDDEN],
                    viewable: [client_1.RoomType.PUBLIC, client_1.RoomType.PRIVATE],
                    all: Object.keys(client_1.RoomType),
                };
                statusFilterMap = {
                    joined: {
                        members: {
                            some: {
                                profileId: profileId,
                            },
                        },
                    },
                    created: {
                        profileId: profileId,
                    },
                    all: {},
                };
                return [4 /*yield*/, db_1.db.room.findMany({
                        where: {
                            AND: [
                                statusFilterMap[status_1],
                                {
                                    type: {
                                        in: roomFilterListMap[roomType],
                                    },
                                },
                            ],
                        },
                        include: {
                            profile: (0, utils_1.isTruthy)(profile),
                            members: (0, utils_1.isTruthy)(members)
                                ? {
                                    include: {
                                        profile: (0, utils_1.isTruthy)(profilesOfMembers),
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
                                    },
                                }
                                : false,
                            groups: (0, utils_1.isTruthy)(groups)
                                ? {
                                    orderBy: {
                                        createdAt: 'asc',
                                    },
                                }
                                : false,
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    })];
            case 1:
                rooms = _e.sent();
                return [2 /*return*/, res.status(200).json(rooms)];
            case 2:
                error_1 = _e.sent();
                console.error(error_1);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRooms = getRooms;
// Get a room by roomId
var getRoomByRoomId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, _a, profile, members, profilesOfMembers, groups, room, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                roomId = req.params.roomId;
                _a = req.query, profile = _a.profile, members = _a.members, profilesOfMembers = _a.profilesOfMembers, groups = _a.groups;
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: { id: roomId },
                        include: {
                            profile: (0, utils_1.isTruthy)(profile),
                            members: (0, utils_1.isTruthy)(members)
                                ? {
                                    include: {
                                        profile: (0, utils_1.isTruthy)(profilesOfMembers),
                                    },
                                    orderBy: {
                                        createdAt: 'desc',
                                    },
                                }
                                : false,
                            groups: (0, utils_1.isTruthy)(groups)
                                ? {
                                    orderBy: {
                                        createdAt: 'asc',
                                    },
                                }
                                : false,
                        },
                    })];
            case 1:
                room = _b.sent();
                if (!room) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not found',
                        }))];
                }
                return [2 /*return*/, res.status(200).json(room)];
            case 2:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRoomByRoomId = getRoomByRoomId;
// Create new room
var createRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, roomName, _b, roomPassword, _c, roomType, profileId, profile, image, relFolderPath, absFolderPath, imageName, relImagePath, absImagePath, hashedPassword, _d, newRoom, error_3;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 8, , 9]);
                _a = req.body, roomName = _a.roomName, _b = _a.roomPassword, roomPassword = _b === void 0 ? '' : _b;
                _c = req.body.roomType, roomType = _c === void 0 ? 'PUBLIC' : _c;
                profileId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.profileId;
                if (!roomName || !profileId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need room name, type, profile id',
                        }))];
                }
                roomType = roomType.toUpperCase();
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require room image',
                        }))];
                }
                if (!Object.keys(client_1.RoomType).includes(roomType)) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Invalid room type',
                        }))];
                }
                if (roomType === 'PRIVATE' && !roomPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require password for private room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                        select: { id: true },
                    })];
            case 1:
                profile = _f.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                image = req.file;
                relFolderPath = '/public/rooms';
                absFolderPath = path_1.default.join(__dirname, '..', '..', relFolderPath);
                imageName = "".concat((0, utils_1.getFileName)(image.originalname), "_").concat((0, utils_1.uuid)(), ".webp");
                relImagePath = path_1.default.join(relFolderPath, imageName);
                absImagePath = path_1.default.join(absFolderPath, imageName);
                return [4 /*yield*/, (0, utils_1.mkdirIfNotExist)(absFolderPath)];
            case 2:
                _f.sent();
                return [4 /*yield*/, (0, sharp_1.default)(image.buffer).resize(constants_1.AVATAR_WIDTH, constants_1.AVATAR_HEIGHT).webp().toFile(absImagePath)];
            case 3:
                _f.sent();
                if (!(roomType === 'PRIVATE')) return [3 /*break*/, 5];
                return [4 /*yield*/, bcrypt_1.default.hash(roomPassword, 10)];
            case 4:
                _d = _f.sent();
                return [3 /*break*/, 6];
            case 5:
                _d = '';
                _f.label = 6;
            case 6:
                hashedPassword = _d;
                return [4 /*yield*/, db_1.db.room.create({
                        data: {
                            name: roomName,
                            type: roomType,
                            password: hashedPassword,
                            imageUrl: relImagePath,
                            inviteCode: (0, utils_1.uuid)(),
                            profileId: profile.id,
                            members: {
                                create: [{ role: client_1.MemberRole.ADMIN, profileId: profile.id }],
                            },
                            groups: {
                                create: [{ name: 'default', profileId: profile.id }],
                            },
                        },
                        include: {
                            profile: true,
                            members: true,
                            groups: true,
                        },
                    })];
            case 7:
                newRoom = _f.sent();
                return [2 /*return*/, res.status(200).json(newRoom)];
            case 8:
                error_3 = _f.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createRoom = createRoom;
// join room
var joinRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, roomPassword, profileId, _a, profile_1, room_1, isAlreadyJoinServer, updateRoom_1, _b, _c, _d, isRightPassword, _e, _f, error_4;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 9, , 10]);
                roomId = req.params.roomId;
                roomPassword = req.body.roomPassword;
                profileId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.profileId;
                return [4 /*yield*/, Promise.all([
                        db_1.db.profile.findUnique({
                            where: { id: profileId },
                            select: { id: true },
                        }),
                        db_1.db.room.findFirst({
                            where: { id: roomId },
                            include: {
                                members: true,
                            },
                        }),
                    ])];
            case 1:
                _a = _h.sent(), profile_1 = _a[0], room_1 = _a[1];
                if (!profile_1) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!room_1) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not found',
                        }))];
                }
                isAlreadyJoinServer = room_1.members.find(function (mem) { return mem.profileId === profile_1.id; });
                if (isAlreadyJoinServer) {
                    return [2 /*return*/, res.status(204).json((0, utils_1.createMsg)({
                            type: 'success',
                            successMessage: 'Profile already join this room',
                        }))];
                }
                updateRoom_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updatedRoom;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, db_1.db.room.update({
                                    where: {
                                        id: room_1.id,
                                    },
                                    data: {
                                        members: {
                                            create: [
                                                {
                                                    profileId: profile_1.id,
                                                },
                                            ],
                                        },
                                    },
                                })];
                            case 1:
                                updatedRoom = _a.sent();
                                return [2 /*return*/, updatedRoom];
                        }
                    });
                }); };
                _b = room_1.type;
                switch (_b) {
                    case 'PUBLIC': return [3 /*break*/, 2];
                    case 'PRIVATE': return [3 /*break*/, 4];
                }
                return [3 /*break*/, 7];
            case 2:
                _d = (_c = res.status(200)).json;
                return [4 /*yield*/, updateRoom_1()];
            case 3: return [2 /*return*/, _d.apply(_c, [_h.sent()])];
            case 4:
                if (!roomPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require password for private room',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(roomPassword, room_1.password)];
            case 5:
                isRightPassword = _h.sent();
                if (!isRightPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Unauthenticated permission for private room',
                        }))];
                }
                _f = (_e = res.status(200)).json;
                return [4 /*yield*/, updateRoom_1()];
            case 6: return [2 /*return*/, _f.apply(_e, [_h.sent()])];
            case 7:
                {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not join room',
                        }))];
                }
                _h.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_4 = _h.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.joinRoom = joinRoom;
// join room by inviteCode
var joinRoomByInviteCode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inviteCode, profileId, _a, profile_2, room, isAlreadyJoinServer, updatedRoom, error_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                inviteCode = req.params.inviteCode;
                profileId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.profileId;
                return [4 /*yield*/, Promise.all([
                        db_1.db.profile.findUnique({
                            where: { id: profileId },
                            select: { id: true },
                        }),
                        db_1.db.room.findFirst({
                            where: {
                                inviteCode: inviteCode,
                            },
                            include: {
                                members: true,
                            },
                        }),
                    ])];
            case 1:
                _a = _c.sent(), profile_2 = _a[0], room = _a[1];
                if (!profile_2) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not found or Invite code not exist',
                        }))];
                }
                isAlreadyJoinServer = room.members.find(function (mem) { return mem.profileId === profile_2.id; });
                if (isAlreadyJoinServer) {
                    return [2 /*return*/, res.status(204).json((0, utils_1.createMsg)({
                            type: 'success',
                            successMessage: 'Profile already join this room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: room.id,
                        },
                        data: {
                            members: {
                                create: [
                                    {
                                        profileId: profile_2.id,
                                    },
                                ],
                            },
                        },
                    })];
            case 2:
                updatedRoom = _c.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 3:
                error_5 = _c.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.joinRoomByInviteCode = joinRoomByInviteCode;
// Leave room
var leaveRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, profileId, _a, profile, room, updatedRoom, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                roomId = req.params.roomId;
                profileId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.profileId;
                return [4 /*yield*/, Promise.all([
                        db_1.db.profile.findUnique({
                            where: { id: profileId },
                            select: { id: true },
                        }),
                        db_1.db.room.findFirst({
                            where: {
                                id: roomId,
                            },
                            include: {
                                members: true,
                            },
                        }),
                    ])];
            case 1:
                _a = _c.sent(), profile = _a[0], room = _a[1];
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not exist',
                        }))];
                }
                if (room.profileId === profile.id) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not leave room that created by yourself',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: room.id,
                            profileId: {
                                not: profile.id,
                            },
                            members: {
                                some: {
                                    profileId: profile.id,
                                },
                            },
                        },
                        data: {
                            members: {
                                deleteMany: {
                                    profileId: profile.id,
                                },
                            },
                        },
                    })];
            case 2:
                updatedRoom = _c.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 3:
                error_6 = _c.sent();
                console.error(error_6);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.leaveRoom = leaveRoom;
// Update a room by roomId
var updateRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, _a, newRoomName, _b, newServerPassword, newRoomType, profileId, room, updatedData, hashedPassword, _c, image, imageName, relFolderPath, absFolderPath, relImagePath, absImagePath, oldImagePath, updatedRoom, error_7;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 10, , 11]);
                roomId = req.params.roomId;
                _a = req.body, newRoomName = _a.roomName, _b = _a.roomPassword, newServerPassword = _b === void 0 ? '' : _b;
                newRoomType = req.body.roomType;
                profileId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.profileId;
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: roomId,
                        },
                    })];
            case 1:
                room = _f.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not exist',
                        }))];
                }
                // Only the room creatator can update room
                if (room.profileId !== profileId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only Admin can update room',
                        }))];
                }
                updatedData = {};
                if (newRoomName) {
                    updatedData.name = newRoomName;
                }
                if (!newRoomType) return [3 /*break*/, 5];
                newRoomType = newRoomType.toUpperCase();
                if (!Object.keys(client_1.RoomType).includes(newRoomType)) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Invalid room type',
                        }))];
                }
                if (newRoomType === 'PRIVATE' && !newServerPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require password for private room',
                        }))];
                }
                if (!(newRoomType === 'PRIVATE')) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.hash(newServerPassword, 10)];
            case 2:
                _c = _f.sent();
                return [3 /*break*/, 4];
            case 3:
                _c = '';
                _f.label = 4;
            case 4:
                hashedPassword = _c;
                updatedData.password = hashedPassword;
                updatedData.type = newRoomType;
                _f.label = 5;
            case 5:
                if (!(req.files !== undefined &&
                    Array.isArray(req.files) &&
                    ((_e = req.files[0]) === null || _e === void 0 ? void 0 : _e.fieldname) === 'roomImage')) return [3 /*break*/, 8];
                image = req.files[0];
                imageName = "".concat((0, utils_1.getFileName)(image.originalname), "_").concat((0, utils_1.uuid)(), ".webp");
                relFolderPath = '/public/rooms';
                absFolderPath = path_1.default.join(__dirname, '..', '..', relFolderPath);
                relImagePath = path_1.default.join(relFolderPath, imageName);
                absImagePath = path_1.default.join(absFolderPath, imageName);
                return [4 /*yield*/, (0, utils_1.mkdirIfNotExist)(absFolderPath)];
            case 6:
                _f.sent();
                return [4 /*yield*/, (0, sharp_1.default)(image.buffer).resize(constants_1.AVATAR_WIDTH, constants_1.AVATAR_HEIGHT).webp().toFile(absImagePath)];
            case 7:
                _f.sent();
                if (room.imageUrl) {
                    oldImagePath = path_1.default.join(absFolderPath, room.imageUrl);
                    (0, utils_1.removeIfExist)(oldImagePath);
                }
                updatedData.imageUrl = relImagePath;
                _f.label = 8;
            case 8: return [4 /*yield*/, db_1.db.room.update({
                    where: {
                        id: room.id,
                    },
                    data: updatedData,
                })];
            case 9:
                updatedRoom = _f.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 10:
                error_7 = _f.sent();
                console.error(error_7);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.updateRoom = updateRoom;
// Delete a room by roomId
var deleteRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, profileId, room, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                roomId = req.params.roomId;
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: { id: roomId },
                    })];
            case 1:
                room = _b.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Room not found',
                        }))];
                }
                // Only the room creatator can update room
                if (room.profileId !== profileId) {
                    return [2 /*return*/, res.status(403).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only Admin can delete room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.delete({
                        where: {
                            id: roomId,
                        },
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).send((0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Room deleted successfully',
                    }))];
            case 3:
                error_8 = _b.sent();
                console.error(error_8);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteRoom = deleteRoom;
