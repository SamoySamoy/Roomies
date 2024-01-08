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
exports.createResult = exports.createMsg = exports.sendPasswordResetEmail = exports.decodeToken = exports.genToken = exports.tokenOptionsMap = exports.removeIfExist = exports.mkdirIfNotExist = exports.isImageFile = exports.getFileName = exports.getExtName = exports.getFormatedDate = exports.convertMbToBytes = exports.isTruthy = exports.uuid = exports.createNewConversation = exports.findConversation = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var fs_1 = __importDefault(require("fs"));
var node_crypto_1 = require("node:crypto");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("./config");
var constants_1 = require("./constants");
var db_1 = require("../prisma/db");
// export const getIp = (req: Request) =>
//   (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();
// export const addIp = async (email: string, ip: string | undefined): Promise<Profile | null> => {
//   try {
//     const updatedProfile = await db.profile.update({
//       where: { email },
//       data: { ip },
//     });
//     return updatedProfile;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };
var findConversation = function (memberOneId, memberTwoId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db.conversation.findFirst({
                        where: {
                            AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
            case 1: return [2 /*return*/, _b.sent()];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findConversation = findConversation;
var createNewConversation = function (memberOneId, memberTwoId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.db.conversation.create({
                        data: {
                            memberOneId: memberOneId,
                            memberTwoId: memberTwoId,
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
            case 1: return [2 /*return*/, _b.sent()];
            case 2:
                _a = _b.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createNewConversation = createNewConversation;
exports.uuid = node_crypto_1.randomUUID;
var isTruthy = function (value) { return constants_1.TRUTHY.includes(value); };
exports.isTruthy = isTruthy;
var convertMbToBytes = function (mb) { return mb * Math.pow(1024, 2); };
exports.convertMbToBytes = convertMbToBytes;
var getFormatedDate = function () {
    var now = new Date();
    return "".concat(now.toLocaleDateString(), " ").concat(now.toLocaleTimeString());
};
exports.getFormatedDate = getFormatedDate;
var getExtName = function (filename) {
    return path_1.default.extname(filename).slice(1).toLowerCase();
};
exports.getExtName = getExtName;
var getFileName = function (filename) {
    return path_1.default.parse(filename).name;
};
exports.getFileName = getFileName;
var isImageFile = function (filename) {
    if (!filename)
        return false;
    // path.extname trả về đuôi file có chấm ở đầu (VD: .img, .pdf)
    var fileExt = (0, exports.getExtName)(filename);
    return constants_1.IMAGE_EXT_LIST.includes(fileExt);
};
exports.isImageFile = isImageFile;
var mkdirIfNotExist = function (absFolderPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs_1.default.existsSync(absFolderPath))
                    return [2 /*return*/];
                return [4 /*yield*/, promises_1.default.mkdir(absFolderPath, {
                        recursive: true,
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.mkdirIfNotExist = mkdirIfNotExist;
var removeIfExist = function (absFolderPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs_1.default.existsSync(absFolderPath))
                    return [2 /*return*/];
                return [4 /*yield*/, promises_1.default.unlink(absFolderPath)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.removeIfExist = removeIfExist;
exports.tokenOptionsMap = {
    accessToken: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        jwtOptions: {
            expiresIn: '30m',
        },
    },
    refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET,
        jwtOptions: {
            expiresIn: '12h',
        },
    },
    resetToken: {
        secret: process.env.RESET_TOKEN_SECRET,
        jwtOptions: {
            expiresIn: '1h',
        },
    },
};
var genToken = function (arg) {
    var tokenOptions = exports.tokenOptionsMap[arg.type];
    return jsonwebtoken_1.default.sign(arg.payload, tokenOptions.secret, tokenOptions.jwtOptions);
};
exports.genToken = genToken;
var decodeToken = function (arg) {
    var result = null;
    jsonwebtoken_1.default.verify(arg.token, exports.tokenOptionsMap[arg.type].secret, function (err, decoded) {
        if (!err) {
            result = decoded;
        }
    });
    return result;
};
exports.decodeToken = decodeToken;
var sendPasswordResetEmail = function (arg) {
    var resetLink = "".concat(constants_1.CLIENT_LOCATION, "/reset/").concat(arg.token);
    var mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: arg.email,
        subject: 'Roomies: Reset password',
        text: "Click the following link to reset your password: ".concat(resetLink),
    };
    config_1.smtpTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
var createMsg = function (arg) {
    switch (arg.type) {
        case 'success':
            return {
                success: arg.successMessage || 'Execute action successfully',
            };
        case 'invalid':
            return {
                invalid: arg.invalidMessage || 'Bad Request',
            };
        case 'error':
            return {
                error: arg.errorMessage || 'Internal Server Error',
            };
    }
};
exports.createMsg = createMsg;
var createResult = function (arg) {
    switch (arg.type) {
        case 'one':
            return arg.item;
        case 'paging:cursor':
            return {
                items: arg.items,
                lastCursor: arg.lastCursor,
            };
    }
};
exports.createResult = createResult;
