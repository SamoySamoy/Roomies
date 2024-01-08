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
exports.changePassword = exports.deleteProfileImage = exports.uploadProfileImage = exports.getProfileByProfileId = void 0;
var db_1 = require("../prisma/db");
var sharp_1 = __importDefault(require("sharp"));
var utils_1 = require("../lib/utils");
var path_1 = __importDefault(require("path"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var constants_1 = require("../lib/constants");
var getProfileByProfileId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, _a, rooms, members, groups, profile, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                profileId = req.params.profileId;
                _a = req.query, rooms = _a.rooms, members = _a.members, groups = _a.groups;
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                        include: {
                            rooms: (0, utils_1.isTruthy)(rooms),
                            members: (0, utils_1.isTruthy)(members),
                            groups: (0, utils_1.isTruthy)(groups),
                        },
                    })];
            case 1:
                profile = _b.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                return [2 /*return*/, res.status(200).json(profile)];
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
exports.getProfileByProfileId = getProfileByProfileId;
var uploadProfileImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, profile, image, imageName, relFolderPath, absFolderPath, relImagePath, absImagePath, oldImagePath, updatedProfile, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Require profile image',
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
                image = req.file;
                imageName = "".concat((0, utils_1.getFileName)(image.originalname), "_").concat((0, utils_1.uuid)(), ".webp");
                relFolderPath = '/public/users';
                absFolderPath = path_1.default.join(__dirname, '..', '..', relFolderPath);
                relImagePath = path_1.default.join(relFolderPath, imageName);
                absImagePath = path_1.default.join(absFolderPath, imageName);
                return [4 /*yield*/, (0, utils_1.mkdirIfNotExist)(absFolderPath)];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, sharp_1.default)(image.buffer).resize(constants_1.AVATAR_WIDTH, constants_1.AVATAR_HEIGHT).webp().toFile(absImagePath)];
            case 3:
                _b.sent();
                if (profile.imageUrl) {
                    oldImagePath = path_1.default.join(absFolderPath, profile.imageUrl);
                    (0, utils_1.removeIfExist)(oldImagePath);
                }
                return [4 /*yield*/, db_1.db.profile.update({
                        where: { id: profileId },
                        data: {
                            imageUrl: relImagePath,
                        },
                        select: {
                            email: true,
                            imageUrl: true,
                        },
                    })];
            case 4:
                updatedProfile = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedProfile)];
            case 5:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.uploadProfileImage = uploadProfileImage;
var deleteProfileImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, profile, oldImagePath, updatedProfile, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                profileId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.profileId;
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
                if (profile.imageUrl) {
                    oldImagePath = path_1.default.join(__dirname, '..', '..', profile.imageUrl);
                    (0, utils_1.removeIfExist)(oldImagePath);
                }
                return [4 /*yield*/, db_1.db.profile.update({
                        where: { id: profileId },
                        data: {
                            imageUrl: null,
                        },
                        select: {
                            email: true,
                            imageUrl: true,
                        },
                    })];
            case 2:
                updatedProfile = _b.sent();
                return [2 /*return*/, res.status(200).json(updatedProfile)];
            case 3:
                error_3 = _b.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProfileImage = deleteProfileImage;
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, profileId, profile, isRightCurrentPassword, newHashedPassword, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                profileId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.profileId;
                if (!currentPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need current password and new password',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { id: profileId },
                    })];
            case 1:
                profile = _c.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Profile not found',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, profile.password)];
            case 2:
                isRightCurrentPassword = _c.sent();
                if (!isRightCurrentPassword) {
                    return [2 /*return*/, res.status(401).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Unauthentication',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                newHashedPassword = _c.sent();
                return [4 /*yield*/, db_1.db.profile.update({
                        where: { id: profileId },
                        data: {
                            password: newHashedPassword,
                        },
                    })];
            case 4:
                _c.sent();
                return [2 /*return*/, res.status(200).json((0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Change password successfully',
                    }))];
            case 5:
                error_4 = _c.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
