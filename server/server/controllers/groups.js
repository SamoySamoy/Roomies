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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.updateGroup = exports.createGroup = exports.getGroupByGroupId = exports.getGroups = void 0;
var db_1 = require("../prisma/db");
var client_1 = require("@prisma/client");
var utils_1 = require("../lib/utils");
var getGroups = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, messages, profile, roomId, groups, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, messages = _a.messages, profile = _a.profile, roomId = _a.roomId;
                if (!roomId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require room id',
                        }))];
                }
                return [4 /*yield*/, db_1.db.group.findMany({
                        where: {
                            roomId: roomId,
                        },
                        include: { messages: (0, utils_1.isTruthy)(messages), profile: (0, utils_1.isTruthy)(profile) },
                    })];
            case 1:
                groups = _b.sent();
                return [2 /*return*/, res.status(200).json(groups)];
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
exports.getGroups = getGroups;
// Get a specific group by groupId
var getGroupByGroupId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, _a, messages, profile, group, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                groupId = req.params.groupId;
                _a = req.query, messages = _a.messages, profile = _a.profile;
                return [4 /*yield*/, db_1.db.group.findUnique({
                        where: { id: groupId },
                        include: { messages: (0, utils_1.isTruthy)(messages), profile: (0, utils_1.isTruthy)(profile) },
                    })];
            case 1:
                group = _b.sent();
                if (!group) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group not found',
                        }))];
                }
                return [2 /*return*/, res.status(200).json(group)];
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
exports.getGroupByGroupId = getGroupByGroupId;
// create new group
var createGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupName, roomId, _b, groupType, profileId, _c, profile, room, _d, _e, _f, isExistingGroup, updatedRoom, error_3;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 6, , 7]);
                _a = req.body, groupName = _a.groupName, roomId = _a.roomId, _b = _a.groupType, groupType = _b === void 0 ? 'TEXT' : _b;
                profileId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.profileId;
                if (!groupName || !roomId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need group name, room id',
                        }))];
                }
                if (groupName === 'default') {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Name can not be default',
                        }))];
                }
                _e = (_d = Promise).all;
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                        select: { id: true },
                    })];
            case 1:
                _f = [
                    _h.sent()
                ];
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: roomId,
                            members: {
                                some: {
                                    profileId: profileId,
                                    role: {
                                        in: [client_1.MemberRole.ADMIN, client_1.MemberRole.MODERATOR],
                                    },
                                },
                            },
                        },
                    })];
            case 2: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                        _h.sent()
                    ])])];
            case 3:
                _c = _h.sent(), profile = _c[0], room = _c[1];
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Can not create group. Room not exist or you are not admin or moderator of this room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.group.findFirst({
                        where: {
                            roomId: room.id,
                            name: groupName,
                        },
                    })];
            case 4:
                isExistingGroup = _h.sent();
                if (isExistingGroup) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group with same name already exists in this room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: room.id,
                        },
                        data: {
                            groups: {
                                create: {
                                    name: groupName,
                                    type: groupType,
                                    profileId: profile.id,
                                },
                            },
                        },
                        include: {
                            groups: true,
                        },
                    })];
            case 5:
                updatedRoom = _h.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 6:
                error_3 = _h.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createGroup = createGroup;
var updateGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, groupId, groupName, groupType, _a, profile, group, _b, _c, _d, room, updatedRoom, error_4;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                profileId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.profileId;
                groupId = req.params.groupId;
                groupName = req.body.groupName;
                groupType = req.body.groupType;
                if (groupType) {
                    groupType = groupType.toUpperCase();
                    if (!Object.keys(client_1.GroupType).includes(groupType)) {
                        return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                                type: 'invalid',
                                invalidMessage: 'Invalid room type',
                            }))];
                    }
                }
                _c = (_b = Promise).all;
                _d = [db_1.db.profile.findUnique({
                        where: { id: profileId },
                        select: { id: true },
                    })];
                return [4 /*yield*/, db_1.db.group.findUnique({
                        where: {
                            id: groupId,
                        },
                        include: { messages: true },
                    })];
            case 1: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                        _f.sent()
                    ])])];
            case 2:
                _a = _f.sent(), profile = _a[0], group = _a[1];
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!group) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: group === null || group === void 0 ? void 0 : group.roomId,
                            members: {
                                some: {
                                    profileId: profile === null || profile === void 0 ? void 0 : profile.id,
                                    role: {
                                        in: [client_1.MemberRole.ADMIN, client_1.MemberRole.MODERATOR],
                                    },
                                },
                            },
                        },
                    })];
            case 3:
                room = _f.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'You are not admin or moderator of this room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: group === null || group === void 0 ? void 0 : group.roomId,
                            members: {
                                some: {
                                    profileId: profile === null || profile === void 0 ? void 0 : profile.id,
                                    role: {
                                        in: [client_1.MemberRole.ADMIN, client_1.MemberRole.MODERATOR],
                                    },
                                },
                            },
                        },
                        data: {
                            groups: {
                                update: {
                                    where: {
                                        id: group.id,
                                    },
                                    data: {
                                        name: groupName,
                                        type: groupType,
                                    },
                                },
                            },
                        },
                        include: {
                            groups: true,
                        },
                    })];
            case 4:
                updatedRoom = _f.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 5:
                error_4 = _f.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateGroup = updateGroup;
// Delete a group
var deleteGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, profileId, _a, profile, group, _b, _c, _d, room, updatedRoom, error_5;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                groupId = req.params.groupId;
                profileId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.profileId;
                _c = (_b = Promise).all;
                _d = [db_1.db.profile.findUnique({
                        where: { id: profileId },
                        select: { id: true },
                    })];
                return [4 /*yield*/, db_1.db.group.findUnique({
                        where: {
                            id: groupId,
                        },
                        include: { messages: true },
                    })];
            case 1: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                        _f.sent()
                    ])])];
            case 2:
                _a = _f.sent(), profile = _a[0], group = _a[1];
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                if (!group) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Group not found',
                        }))];
                }
                if (group.name === 'default') {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'You can not delete general group. If you are admin, you can delete whole room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: group === null || group === void 0 ? void 0 : group.roomId,
                            members: {
                                some: {
                                    profileId: profile === null || profile === void 0 ? void 0 : profile.id,
                                    role: {
                                        in: [client_1.MemberRole.ADMIN, client_1.MemberRole.MODERATOR],
                                    },
                                },
                            },
                        },
                    })];
            case 3:
                room = _f.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'You are not admin or moderator of this room',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: group === null || group === void 0 ? void 0 : group.roomId,
                            members: {
                                some: {
                                    profileId: profile === null || profile === void 0 ? void 0 : profile.id,
                                    role: {
                                        in: [client_1.MemberRole.ADMIN, client_1.MemberRole.MODERATOR],
                                    },
                                },
                            },
                        },
                        data: {
                            groups: {
                                delete: {
                                    id: group.id,
                                },
                            },
                        },
                    })];
            case 4:
                updatedRoom = _f.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 5:
                error_5 = _f.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteGroup = deleteGroup;
