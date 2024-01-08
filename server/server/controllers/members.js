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
exports.deleteMember = exports.updateMember = exports.getMembers = void 0;
var db_1 = require("../prisma/db");
var client_1 = require("@prisma/client");
var utils_1 = require("../lib/utils");
var getMembers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, profile, roomId, members, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, profile = _a.profile, roomId = _a.roomId;
                if (!roomId) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require room id',
                        }))];
                }
                return [4 /*yield*/, db_1.db.member.findMany({
                        where: {
                            roomId: roomId,
                        },
                        include: { profile: (0, utils_1.isTruthy)(profile) },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    })];
            case 1:
                members = _b.sent();
                return [2 /*return*/, res.status(200).json(members)];
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
exports.getMembers = getMembers;
// create new group
// export const createMember = async (
//   req: AuthenticatedRequest<any, Partial<BodyCreateGroup>, any>,
//   res: Response,
// ) => {
//   try {
//     const { groupName, roomId, groupType = 'TEXT' } = req.body;
//     const profileId = req.user?.profileId!;
//     if (!groupName || !roomId) {
//       return res.status(400).json({ message: 'Need group name, room id' });
//     }
//     if (groupName === 'default') {
//       return res.status(400).json({ message: 'Name can not be general' });
//     }
//     const [profile, room] = await Promise.all([
//       await db.profile.findUnique({
//         where: { id: profileId },
//         select: { id: true },
//       }),
//       await db.room.findUnique({
//         where: {
//           id: roomId,
//           members: {
//             some: {
//               profileId,
//               role: {
//                 in: [MemberRole.ADMIN, MemberRole.MODERATOR],
//               },
//             },
//           },
//         },
//       }),
//     ]);
//     if (!profile) {
//       return res.status(400).json({ message: 'Profile not found' });
//     }
//     if (!room) {
//       return res.status(400).json({
//         message:
//           'Can not create group. Room not exist or you are not admin or moderator of this room',
//       });
//     }
//     const isExistingGroup = await db.group.findFirst({
//       where: {
//         roomId: room.id,
//         name: groupName,
//       },
//     });
//     if (isExistingGroup) {
//       return res.status(400).json({ message: 'Group with same name already exists in this room' });
//     }
//     const updatedRoom = await db.room.update({
//       where: {
//         id: room.id,
//       },
//       data: {
//         groups: {
//           create: {
//             name: groupName,
//             type: groupType,
//             profileId: profile.id,
//           },
//         },
//       },
//       include: {
//         groups: true,
//       },
//     });
//     return res.status(200).json(updatedRoom);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json(createMsg({
//        type: 'error',
//      }),);
//   }
// };
var updateMember = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, memberId, roomId, role, profile, room, updatedRoom, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                memberId = req.params.memberId;
                roomId = req.query.roomId;
                role = req.body.role;
                if (!role || !memberId || !roomId) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require room id, member id and role',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                    })];
            case 1:
                profile = _b.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: roomId,
                            members: {
                                some: {
                                    profileId: profileId,
                                    role: client_1.MemberRole.ADMIN,
                                },
                            },
                        },
                    })];
            case 2:
                room = _b.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only admin can change role of other members',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: roomId,
                            profileId: profileId,
                        },
                        data: {
                            members: {
                                update: {
                                    where: {
                                        id: memberId,
                                        profileId: {
                                            not: profileId,
                                        },
                                    },
                                    data: {
                                        role: role,
                                    },
                                },
                            },
                        },
                        include: {
                            members: {
                                include: {
                                    profile: true,
                                },
                                orderBy: {
                                    role: 'asc',
                                },
                            },
                        },
                    })];
            case 3:
                updatedRoom = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 4:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateMember = updateMember;
// Delete a member
var deleteMember = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, memberId, roomId, profile, room, updatedRoom, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                memberId = req.params.memberId;
                roomId = req.query.roomId;
                if (!memberId || !roomId) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require room id, member id',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                    })];
            case 1:
                profile = _b.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.findUnique({
                        where: {
                            id: roomId,
                            members: {
                                some: {
                                    profileId: profileId,
                                    role: client_1.MemberRole.ADMIN,
                                },
                            },
                        },
                    })];
            case 2:
                room = _b.sent();
                if (!room) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Only admin can kick other members',
                        }))];
                }
                return [4 /*yield*/, db_1.db.room.update({
                        where: {
                            id: roomId,
                            profileId: profileId,
                        },
                        data: {
                            members: {
                                deleteMany: {
                                    id: memberId,
                                    profileId: {
                                        not: profileId,
                                    },
                                },
                            },
                        },
                        include: {
                            members: {
                                include: {
                                    profile: true,
                                },
                                orderBy: {
                                    role: 'asc',
                                },
                            },
                        },
                    })];
            case 3:
                updatedRoom = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedRoom)];
            case 4:
                error_3 = _b.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteMember = deleteMember;
