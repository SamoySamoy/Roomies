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
exports.refresh = exports.reset = exports.forgot = exports.logout = exports.login = exports.register = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var db_1 = require("../prisma/db");
var config_1 = require("../lib/config");
var utils_1 = require("../lib/utils");
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, duplicateProfile, hashedPassword, newProfile, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need email and password',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { email: email },
                    })];
            case 1:
                duplicateProfile = _b.sent();
                if (duplicateProfile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Email already in used',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db_1.db.profile.create({
                        data: {
                            email: email,
                            password: hashedPassword,
                        },
                    })];
            case 3:
                newProfile = _b.sent();
                return [2 /*return*/, res.status(201).json((0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Profile created successfully!',
                    }))];
            case 4:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, profile, isRightPassword, oldRefreshToken, oldRefreshTokenInDb, accessToken, refreshToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need email and password',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { email: email },
                    })];
            case 1:
                profile = _b.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Email not found',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, profile.password)];
            case 2:
                isRightPassword = _b.sent();
                if (!isRightPassword) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Wrong email or password',
                        }))];
                }
                if (!req.cookies.jwt) return [3 /*break*/, 8];
                oldRefreshToken = req.cookies.jwt;
                return [4 /*yield*/, db_1.db.refreshToken.findFirst({
                        where: {
                            refreshToken: oldRefreshToken,
                            id: profile.id,
                        },
                    })];
            case 3:
                oldRefreshTokenInDb = _b.sent();
                if (!oldRefreshTokenInDb) return [3 /*break*/, 5];
                return [4 /*yield*/, db_1.db.refreshToken.delete({
                        where: {
                            id: oldRefreshTokenInDb.id,
                        },
                    })];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5: 
            // Không tìm thấy trong DB tương ứng với oldRefreshToken bởi vì oldRefreshToken đã được sử dụng bởi hacker
            // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
            return [4 /*yield*/, db_1.db.refreshToken.deleteMany({
                    where: {
                        profileId: profile.id,
                    },
                })];
            case 6:
                // Không tìm thấy trong DB tương ứng với oldRefreshToken bởi vì oldRefreshToken đã được sử dụng bởi hacker
                // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
                _b.sent();
                _b.label = 7;
            case 7:
                res.clearCookie('jwt', config_1.refreshTokenCookieOptions);
                _b.label = 8;
            case 8:
                accessToken = (0, utils_1.genToken)({
                    type: 'accessToken',
                    payload: {
                        profileId: profile.id,
                        email: profile.email,
                        imageUrl: profile.imageUrl,
                    },
                });
                refreshToken = (0, utils_1.genToken)({
                    type: 'refreshToken',
                    payload: {
                        profileId: profile.id,
                    },
                });
                return [4 /*yield*/, db_1.db.refreshToken.create({
                        data: {
                            profileId: profile.id,
                            refreshToken: refreshToken,
                        },
                    })];
            case 9:
                _b.sent();
                res.cookie('jwt', refreshToken, config_1.refreshTokenCookieOptions);
                return [2 /*return*/, res.status(200).json(__assign({ accessToken: accessToken }, (0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Login successfully',
                    })))];
            case 10:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, refreshTokenInDb;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.cookies.jwt)
                    return [2 /*return*/, res.sendStatus(204)];
                refreshToken = req.cookies.jwt;
                return [4 /*yield*/, db_1.db.refreshToken.findFirst({
                        where: {
                            refreshToken: refreshToken,
                        },
                    })];
            case 1:
                refreshTokenInDb = _a.sent();
                if (!refreshTokenInDb) {
                    res.clearCookie('jwt', config_1.refreshTokenCookieOptions);
                    return [2 /*return*/, res.sendStatus(204)];
                }
                return [4 /*yield*/, db_1.db.refreshToken.delete({
                        where: {
                            id: refreshTokenInDb.id,
                        },
                    })];
            case 2:
                _a.sent();
                res.clearCookie('jwt', config_1.refreshTokenCookieOptions);
                return [2 /*return*/, res.sendStatus(204)];
        }
    });
}); };
exports.logout = logout;
var forgot = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, profile, resetToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need email',
                        }))];
                }
                return [4 /*yield*/, db_1.db.profile.findUnique({
                        where: { email: email },
                    })];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(404).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Email not found',
                        }))];
                }
                resetToken = (0, utils_1.genToken)({
                    type: 'resetToken',
                    payload: {
                        profileId: profile.id,
                    },
                });
                return [4 /*yield*/, db_1.db.resetToken.create({
                        data: {
                            profileId: profile.id,
                            resetToken: resetToken,
                        },
                    })];
            case 2:
                _a.sent();
                (0, utils_1.sendPasswordResetEmail)({
                    email: profile.email,
                    token: resetToken,
                });
                return [2 /*return*/, res.status(200).json((0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Password reset email sent',
                    }))];
            case 3:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgot = forgot;
var reset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, token, resetTokenInDb, decoded, hashedPassword, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                password = req.body.password;
                token = req.params.token;
                if (!token || !password) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Need reset token and new password',
                        }))];
                }
                return [4 /*yield*/, db_1.db.resetToken.findFirst({
                        where: {
                            resetToken: token,
                        },
                    })];
            case 1:
                resetTokenInDb = _a.sent();
                if (!resetTokenInDb) {
                    return [2 /*return*/, res.status(400).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Invalid token',
                        }))];
                }
                decoded = (0, utils_1.decodeToken)({
                    type: 'resetToken',
                    token: resetTokenInDb.resetToken,
                });
                if (!decoded) {
                    return [2 /*return*/, res.status(401).json((0, utils_1.createMsg)({
                            type: 'invalid',
                            invalidMessage: 'Invalid token or expired token',
                        }))];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, Promise.all([
                        db_1.db.profile.update({
                            where: { id: decoded.profileId },
                            data: {
                                password: hashedPassword,
                            },
                        }),
                        db_1.db.resetToken.delete({
                            where: {
                                id: resetTokenInDb.id,
                            },
                        }),
                    ])];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Password reset successful' })];
            case 4:
                error_4 = _a.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.reset = reset;
var refresh = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existRefreshToken, refreshTokenInDb, decodedExistToken, decoded, newAccessToken, newRefreshToken, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                // Check if lack of info
                // No refresh token in cookie means unauthentication
                if (!req.cookies.jwt) {
                    return [2 /*return*/, res.sendStatus(401)];
                }
                existRefreshToken = req.cookies.jwt;
                // Delete old cookies
                res.clearCookie('jwt', config_1.refreshTokenCookieOptions);
                return [4 /*yield*/, db_1.db.refreshToken.findFirst({
                        where: {
                            refreshToken: existRefreshToken,
                        },
                        include: {
                            profile: true,
                        },
                    })];
            case 1:
                refreshTokenInDb = _a.sent();
                if (!!refreshTokenInDb) return [3 /*break*/, 3];
                decodedExistToken = (0, utils_1.decodeToken)({
                    type: 'refreshToken',
                    token: existRefreshToken,
                });
                // existRefreshToken fake hoặc hết hạn
                if (!decodedExistToken) {
                    return [2 /*return*/, res.sendStatus(403)];
                }
                // Nếu refresh vẫn còn hạn tức là đã bị dùng bởi hacker
                // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
                return [4 /*yield*/, db_1.db.refreshToken.deleteMany({
                        where: {
                            profileId: decodedExistToken.profileId,
                        },
                    })];
            case 2:
                // Nếu refresh vẫn còn hạn tức là đã bị dùng bởi hacker
                // Clear các refresh token còn lại và bắt các thiết bị khác đăng nhập lại
                _a.sent();
                return [2 /*return*/, res.sendStatus(403)];
            case 3: 
            // Xóa token cũ trong DB
            return [4 /*yield*/, db_1.db.refreshToken.delete({
                    where: {
                        id: refreshTokenInDb.id,
                    },
                })];
            case 4:
                // Xóa token cũ trong DB
                _a.sent();
                decoded = (0, utils_1.decodeToken)({
                    type: 'refreshToken',
                    token: refreshTokenInDb.refreshToken,
                });
                // Token hết hạn hoặc lỗi
                if (!decoded) {
                    return [2 /*return*/, res.sendStatus(403)];
                }
                newAccessToken = (0, utils_1.genToken)({
                    type: 'accessToken',
                    payload: {
                        profileId: refreshTokenInDb.profile.id,
                        email: refreshTokenInDb.profile.email,
                        imageUrl: refreshTokenInDb.profile.imageUrl,
                    },
                });
                newRefreshToken = (0, utils_1.genToken)({
                    type: 'refreshToken',
                    payload: {
                        profileId: refreshTokenInDb.profile.id,
                    },
                });
                return [4 /*yield*/, db_1.db.refreshToken.create({
                        data: {
                            profileId: refreshTokenInDb.profile.id,
                            refreshToken: newRefreshToken,
                        },
                    })];
            case 5:
                _a.sent();
                res.cookie('jwt', newRefreshToken, config_1.refreshTokenCookieOptions);
                return [2 /*return*/, res.status(200).json(__assign({ accessToken: newAccessToken }, (0, utils_1.createMsg)({
                        type: 'success',
                        successMessage: 'Refresh successfully',
                    })))];
            case 6:
                error_5 = _a.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json((0, utils_1.createMsg)({
                        type: 'error',
                    }))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.refresh = refresh;
