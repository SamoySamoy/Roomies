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
exports.setupWs = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises"));
var sharp_1 = __importDefault(require("sharp"));
var socket_io_1 = require("socket.io");
var db_1 = require("./prisma/db");
var client_1 = require("@prisma/client");
var config_1 = require("./lib/config");
var constants_1 = require("./lib/constants");
var types_1 = require("./lib/types");
var utils_1 = require("./lib/utils");
/*
fakeRedis = {
  `groupdId`: {
    `profileId`: {...MeetingState}
  }
}
*/
var fakeRedis = {};
var getMeetingStates = function (groupId) {
    if (!fakeRedis[groupId]) {
        fakeRedis[groupId] = {};
    }
    return fakeRedis[groupId];
};
var createMeetingState = function (groupId, newState) {
    if (!fakeRedis[groupId]) {
        fakeRedis[groupId] = {};
    }
    fakeRedis[groupId]["".concat(newState.profileId)] = newState;
};
var updateMeetingState = function (groupId, identity, toggle) {
    console.log(toggle);
    if (!fakeRedis[groupId] || !fakeRedis[groupId]["".concat(identity.profileId)]) {
        return;
    }
    var oldState = fakeRedis[groupId]["".concat(identity.profileId)];
    if (oldState.type === 'screen') {
        return;
    }
    var newState;
    switch (toggle) {
        case 'camera':
            newState = __assign(__assign({}, oldState), { cameraOn: !oldState.cameraOn });
            break;
        case 'mic':
            newState = __assign(__assign({}, oldState), { micOn: !oldState.micOn });
            break;
    }
    fakeRedis[groupId]["".concat(identity.profileId)] = newState;
};
var deleteMeetingState = function (groupId, identity, email) {
    if (email) {
        if (!fakeRedis[groupId])
            return;
        var profileIdWithSameEmail_1 = [];
        Object.keys(fakeRedis[groupId]).forEach(function (profileId) {
            var state = fakeRedis[groupId][profileId];
            if (state.email === email)
                profileIdWithSameEmail_1.push(profileId);
        });
        profileIdWithSameEmail_1.forEach(function (deletedProfileId) {
            delete fakeRedis[groupId][deletedProfileId];
        });
    }
    else {
        if (!fakeRedis[groupId] || !fakeRedis[groupId]["".concat(identity.profileId)]) {
            return;
        }
        delete fakeRedis[groupId]["".concat(identity.profileId)];
    }
    if (Array.from(Object.keys(fakeRedis[groupId])).length === 0) {
        delete fakeRedis[groupId];
    }
};
function setupWs(httpServer) {
    var _this = this;
    var io = new socket_io_1.Server(httpServer, {
        path: '/api/socket',
        serveClient: false,
        addTrailingSlash: false,
        cors: config_1.corsOptions,
        maxHttpBufferSize: (0, utils_1.convertMbToBytes)(constants_1.IMAGE_SIZE_LIMIT_IN_MB),
    });
    io.on('connection', function (socket) {
        // On user join room
        socket.on('client:room:join', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.join(origin.roomId);
                try {
                    // On user join room - to user only
                    socket.emit('server:room:join:success', "You just join room ".concat(origin.roomId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:room:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:room:join:error', "Unexpected error. Something went wrong");
                    }
                }
                // On user join room - to other user in room
                try {
                    socket.broadcast
                        .to(origin.roomId)
                        .emit('server:room:join:success', "".concat(arg.email, " just join room ").concat(origin.profileId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:room:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:room:join:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user leave room
        socket.on('client:room:leave', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.leave(origin.roomId);
                try {
                    io.to(origin.roomId).emit('server:room:leave:success', "".concat(arg.email, " ").concat(origin.profileId, " just leave room"));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:room:leave:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:room:leave:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user kick member
        socket.on('client:room:kick', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, kickMember(origin, arg)];
                    case 1:
                        _a.sent();
                        // On user kick member - to the one whom have been kicked
                        socket.broadcast.to(origin.roomId).emit('server:room:kick:success', arg);
                        // To admin
                        socket.emit('server:room:kick:success', arg);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof types_1.ValidationError) {
                            socket.emit('server:room:kick:error', "".concat(error_1.message));
                            console.log(error_1);
                        }
                        else {
                            socket.emit('server:room:kick:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user change role member
        socket.on('client:room:role', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, changeRoleMember(origin, arg)];
                    case 1:
                        _a.sent();
                        // On user kick member - to the one whom have been kicked
                        socket.broadcast.to(origin.roomId).emit('server:room:role:success', arg);
                        // To admin
                        socket.emit('server:room:role:success', arg);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof types_1.ValidationError) {
                            socket.emit('server:room:role:error', "".concat(error_2.message));
                            console.log(error_2);
                        }
                        else {
                            socket.emit('server:room:role:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user join group
        socket.on('client:group:join', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.join(origin.groupId);
                try {
                    // On user join group - to user only
                    socket.emit('server:group:join:success', "You just join group ".concat(origin.groupId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:group:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:group:join:error', "Unexpected error. Something went wrong");
                    }
                }
                // On user join group - to other user in group
                try {
                    socket.broadcast
                        .to(origin.groupId)
                        .emit('server:group:join:success', "".concat(arg.email, " just join group ").concat(origin.profileId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:group:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:group:join:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user leave group
        socket.on('client:group:leave', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.leave(origin.groupId);
                try {
                    io.to(origin.groupId).emit('server:group:leave:success', "".concat(arg.email, " just leave group"));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:group:leave:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:group:leave:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user typing
        socket.on('client:group:typing', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    socket.broadcast
                        .to(origin.groupId)
                        .emit('server:group:typing:success', "".concat(arg.email, " is typing ..."));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:group:typing:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:group:typing:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user create new message
        socket.on('client:group:message:post', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var newMessage, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, createMessage(origin, arg)];
                    case 1:
                        newMessage = _a.sent();
                        io.to(origin.groupId).emit('server:group:message:post:success', newMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        if (error_3 instanceof types_1.ValidationError) {
                            socket.emit('server:group:message:post:error', "".concat(error_3.message));
                        }
                        else {
                            socket.emit('server:group:message:post:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user upload a file
        socket.on('client:group:message:upload', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var newMessage, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, uploadMessageFile(origin, arg)];
                    case 1:
                        newMessage = _a.sent();
                        io.to(origin.groupId).emit('server:group:message:upload:success', newMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof types_1.ValidationError) {
                            socket.emit('server:group:message:upload:error', "".concat(error_4.message));
                            console.log(error_4);
                        }
                        else {
                            socket.emit('server:group:message:upload:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user update message
        socket.on('client:group:message:update', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var updatedMessage, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, updateMessage(origin, arg)];
                    case 1:
                        updatedMessage = _a.sent();
                        io.to(origin.groupId).emit('server:group:message:update:success', updatedMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof types_1.ValidationError) {
                            socket.emit('server:group:message:update:error', "".concat(error_5.message));
                            console.log(error_5);
                        }
                        else {
                            socket.emit('server:group:message:update:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user delete message
        socket.on('client:group:message:delete', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var deletedMessage, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, deleteMesage(origin, arg)];
                    case 1:
                        deletedMessage = _a.sent();
                        io.to(origin.groupId).emit('server:group:message:delete:success', deletedMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof types_1.ValidationError) {
                            socket.emit('server:group:message:delete:error', "".concat(error_6.message));
                            console.log(error_6);
                        }
                        else {
                            socket.emit('server:group:message:delete:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user join conversation
        socket.on('client:conversation:join', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.join(origin.conversationId);
                try {
                    // On user join conversation - to user only
                    socket.emit('server:conversation:join:success', "You just join conversation ".concat(origin.conversationId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:conversation:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:conversation:join:error', "Unexpected error. Something went wrong");
                    }
                }
                // On user join conversation - to other user in conversation
                try {
                    socket.broadcast
                        .to(origin.conversationId)
                        .emit('server:conversation:join:success', "".concat(arg.email, " just join conversation ").concat(origin.profileId));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:conversation:join:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:conversation:join:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user leave conversation
        socket.on('client:conversation:leave', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                socket.leave(origin.conversationId);
                try {
                    io.to(origin.conversationId).emit('server:conversation:leave:success', "".concat(arg.email, " just leave conversation"));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:conversation:leave:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:conversation:leave:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user typing
        socket.on('client:conversation:typing', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    socket.broadcast
                        .to(origin.conversationId)
                        .emit('server:conversation:typing:success', "".concat(arg.email, " is typing ..."));
                }
                catch (error) {
                    console.log(error);
                    if (error instanceof types_1.ValidationError) {
                        socket.emit('server:conversation:typing:error', "".concat(error.message));
                    }
                    else {
                        socket.emit('server:conversation:typing:error', "Unexpected error. Something went wrong");
                    }
                }
                return [2 /*return*/];
            });
        }); });
        // On user create new message
        socket.on('client:conversation:message:post', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var newDirectMessage, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, createDirectMessage(origin, arg)];
                    case 1:
                        newDirectMessage = _a.sent();
                        io.to(origin.conversationId).emit('server:conversation:message:post:success', newDirectMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        if (error_7 instanceof types_1.ValidationError) {
                            socket.emit('server:conversation:message:post:error', "".concat(error_7.message));
                        }
                        else {
                            socket.emit('server:conversation:message:post:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user upload a file
        socket.on('client:conversation:message:upload', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var newDirectMessage, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, uploadDirectMessageFile(origin, arg)];
                    case 1:
                        newDirectMessage = _a.sent();
                        io.to(origin.conversationId).emit('server:conversation:message:upload:success', newDirectMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        if (error_8 instanceof types_1.ValidationError) {
                            socket.emit('server:conversation:message:upload:error', "".concat(error_8.message));
                            console.log(error_8);
                        }
                        else {
                            socket.emit('server:conversation:message:upload:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user update message
        socket.on('client:conversation:message:update', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var updatedDirectMessage, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, updateDirectMessage(origin, arg)];
                    case 1:
                        updatedDirectMessage = _a.sent();
                        io.to(origin.conversationId).emit('server:conversation:message:update:success', updatedDirectMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        if (error_9 instanceof types_1.ValidationError) {
                            socket.emit('server:conversation:message:update:error', "".concat(error_9.message));
                            console.log(error_9);
                        }
                        else {
                            socket.emit('server:conversation:message:update:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user delete message
        socket.on('client:conversation:message:delete', function (origin, arg) { return __awaiter(_this, void 0, void 0, function () {
            var deletedDirectMessage, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, deleteDirectMesage(origin, arg)];
                    case 1:
                        deletedDirectMessage = _a.sent();
                        io.to(origin.conversationId).emit('server:conversation:message:delete:success', deletedDirectMessage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        if (error_10 instanceof types_1.ValidationError) {
                            socket.emit('server:conversation:message:delete:error', "".concat(error_10.message));
                            console.log(error_10);
                        }
                        else {
                            socket.emit('server:conversation:message:delete:error', "Unexpected error. Something went wrong");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // On user join meeting
        socket.on('client:meeting:join', function (origin, arg) {
            socket.join(origin.groupId);
            console.log('Client join', arg.email);
            socket.once('disconnect', function () {
                socket.leave(origin.groupId);
                console.log('Fake redis before: ', fakeRedis);
                deleteMeetingState(origin.groupId, {
                    profileId: origin.profileId,
                    type: arg.type,
                }, arg.email);
                console.log('Fake redis after: ', fakeRedis);
                // io.to(origin.groupId).emit('server:meeting:disconnect', origin.profileId);
                io.to(origin.groupId).emit('server:meeting:state', getMeetingStates(origin.groupId));
                socket.removeAllListeners();
            });
            try {
                createMeetingState(origin.groupId, arg);
                console.log(arg.email + ' join the meeting');
                console.log(fakeRedis);
                var updatedStates = getMeetingStates(origin.groupId);
                // Gửi danh sách trạng thái về người join
                socket.emit('server:meeting:join:success', updatedStates);
                // Broad cast cập nhật trạng thái
                socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:join:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:join:error', "Unexpected error. Something went wrong");
                }
            }
        });
        // On user leave meeting
        socket.on('client:meeting:leave', function (origin, arg) {
            socket.leave(origin.groupId);
            try {
                console.log(arg.profileId);
                var leaver = fakeRedis[origin.groupId][arg.profileId];
                if (leaver) {
                    console.log('Clinet meeting leave detect', leaver.email);
                    console.log(leaver.email);
                    deleteMeetingState(origin.groupId, arg, leaver.email);
                }
                var updatedStates = getMeetingStates(origin.groupId);
                // Broad cast cập nhật trạng thái
                socket.to(origin.groupId).emit('server:meeting:state', updatedStates);
                console.log('user out group: ' + origin.profileId);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:leave:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:leave:error', "Unexpected error. Something went wrong");
                }
            }
        });
        // On user toggle camera
        socket.on('client:meeting:camera', function (origin, arg) {
            try {
                updateMeetingState(origin.groupId, arg, 'camera');
                console.log(origin.profileId + ' click camera');
                console.log(fakeRedis);
                var updatedStates = getMeetingStates(origin.groupId);
                // Cập nhật trạng thái cho tất cả
                io.to(origin.groupId).emit('server:meeting:state', updatedStates);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:camera:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:camera:error', "Unexpected error. Something went wrong");
                }
            }
        });
        // On user toggle mic
        socket.on('client:meeting:mic', function (origin, arg) {
            try {
                updateMeetingState(origin.groupId, arg, 'mic');
                console.log(origin.profileId + ' click mic');
                console.log(fakeRedis);
                var updatedStates = getMeetingStates(origin.groupId);
                // Cập nhật trạng thái cho tất cả
                io.to(origin.groupId).emit('server:meeting:state', updatedStates);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:mic:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:mic:error', "Unexpected error. Something went wrong");
                }
            }
        });
        // On user turn on share screen
        socket.on('client:meeting:screen:on', function (origin, arg) {
            socket.join(origin.groupId);
            try {
                createMeetingState(origin.groupId, arg);
                var updatedStates = getMeetingStates(origin.groupId);
                // Gửi danh sách trạng thái về người join
                socket.emit('server:meeting:screen:on:success', updatedStates);
                // Broad cast cập nhật trạng thái
                socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:screen:on:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:screen:on:error', "Unexpected error. Something went wrong");
                }
            }
        });
        // On user turn off share screen
        socket.on('client:meeting:screen:off', function (origin, arg) {
            try {
                deleteMeetingState(origin.groupId, arg);
                console.log('remove screen: ' + arg.profileId);
                console.log(getMeetingStates(origin.groupId));
                var updatedStates = getMeetingStates(origin.groupId);
                socket.emit('server:meeting:screen:off:success', updatedStates);
                // Broad cast cập nhật trạng thái
                socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
            }
            catch (error) {
                console.log(error);
                if (error instanceof types_1.ValidationError) {
                    socket.emit('server:meeting:screen:off:error', "".concat(error.message));
                }
                else {
                    socket.emit('server:meeting:screen:off:error', "Unexpected error. Something went wrong");
                }
            }
        });
    });
    // Handle errors on the socket IO instance
    io.on('error', function (error) {
        console.error('Socket.IO error:', error);
        // maybe more
    });
    return io;
}
exports.setupWs = setupWs;
var kickMember = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, profile, room, updatedRoom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id and room id');
                    }
                    if (!arg.memberId) {
                        throw new types_1.ValidationError('Require member id');
                    }
                    return [4 /*yield*/, db_1.db.profile.findUnique({
                            where: { id: origin.profileId },
                        })];
                case 1:
                    profile = _a.sent();
                    if (!profile) {
                        throw new types_1.ValidationError('Profile not found');
                    }
                    return [4 /*yield*/, db_1.db.room.findUnique({
                            where: {
                                id: origin.roomId,
                                members: {
                                    some: {
                                        profileId: origin.profileId,
                                        role: client_1.MemberRole.ADMIN,
                                    },
                                },
                            },
                        })];
                case 2:
                    room = _a.sent();
                    if (!room) {
                        throw new types_1.ValidationError('Only admin can kick other members');
                    }
                    return [4 /*yield*/, db_1.db.room.update({
                            where: {
                                id: origin.roomId,
                                profileId: origin.profileId,
                            },
                            data: {
                                members: {
                                    deleteMany: {
                                        id: arg.memberId,
                                        profileId: {
                                            not: origin.profileId,
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
                    updatedRoom = _a.sent();
                    return [2 /*return*/, updatedRoom];
            }
        });
    });
};
var changeRoleMember = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, profile, room, updatedRoom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id and room id');
                    }
                    if (!arg.memberId || !arg.role) {
                        throw new types_1.ValidationError('Require member id and role');
                    }
                    return [4 /*yield*/, db_1.db.profile.findUnique({
                            where: { id: origin.profileId },
                        })];
                case 1:
                    profile = _a.sent();
                    if (!profile) {
                        throw new types_1.ValidationError('Profile not found');
                    }
                    return [4 /*yield*/, db_1.db.room.findUnique({
                            where: {
                                id: origin.roomId,
                                members: {
                                    some: {
                                        profileId: origin.profileId,
                                        role: client_1.MemberRole.ADMIN,
                                    },
                                },
                            },
                        })];
                case 2:
                    room = _a.sent();
                    if (!room) {
                        throw new types_1.ValidationError('Only admin can change role of other members');
                    }
                    return [4 /*yield*/, db_1.db.room.update({
                            where: {
                                id: origin.roomId,
                                profileId: origin.profileId,
                            },
                            data: {
                                members: {
                                    update: {
                                        where: {
                                            id: arg.memberId,
                                            profileId: {
                                                not: origin.profileId,
                                            },
                                        },
                                        data: {
                                            role: arg.role,
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
                    updatedRoom = _a.sent();
                    return [2 /*return*/, updatedRoom];
            }
        });
    });
};
var createMessage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, _a, group, member, newMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.groupId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id, group id and room id');
                    }
                    if (!arg.content) {
                        throw new types_1.ValidationError('Require message content');
                    }
                    return [4 /*yield*/, Promise.all([
                            db_1.db.group.findFirst({
                                where: {
                                    id: origin.groupId,
                                    roomId: origin.roomId,
                                },
                            }),
                            db_1.db.member.findFirst({
                                where: {
                                    profileId: origin.profileId,
                                    roomId: origin.roomId,
                                },
                            }),
                        ])];
                case 1:
                    _a = _b.sent(), group = _a[0], member = _a[1];
                    if (!group) {
                        throw new types_1.ValidationError("Group ".concat(origin.groupId, " not exist"));
                    }
                    if (!member) {
                        throw new types_1.ValidationError("Can not create message. You are not member of this channel");
                    }
                    return [4 /*yield*/, db_1.db.message.create({
                            data: {
                                content: arg.content,
                                fileUrl: null,
                                groupId: origin.groupId,
                                memberId: member.id,
                            },
                            include: {
                                member: {
                                    include: {
                                        profile: true,
                                    },
                                },
                            },
                        })];
                case 2:
                    newMessage = _b.sent();
                    return [2 /*return*/, newMessage];
            }
        });
    });
};
var uploadMessageFile = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, file, _a, group, member, relFolderPath, absFolderPath, filename, relFilePath, absFilePath, newMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    origin = args[0], file = args[1];
                    if (!origin.profileId || !origin.groupId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id, group id and room id');
                    }
                    if (file.filesize > (0, utils_1.convertMbToBytes)(constants_1.IMAGE_SIZE_LIMIT_IN_MB)) {
                        throw new types_1.ValidationError('File size not over 5 MB');
                    }
                    return [4 /*yield*/, Promise.all([
                            db_1.db.group.findFirst({
                                where: {
                                    id: origin.groupId,
                                    roomId: origin.roomId,
                                },
                            }),
                            db_1.db.member.findFirst({
                                where: {
                                    profileId: origin.profileId,
                                    roomId: origin.roomId,
                                },
                            }),
                        ])];
                case 1:
                    _a = _b.sent(), group = _a[0], member = _a[1];
                    if (!group) {
                        throw new types_1.ValidationError("Group ".concat(origin.groupId, " not exist"));
                    }
                    if (!member) {
                        throw new types_1.ValidationError("Can not create message. You are not member of this channel");
                    }
                    relFolderPath = "/public/groups/".concat(origin.groupId);
                    absFolderPath = path_1.default.join(__dirname, '..', relFolderPath);
                    filename = file.filename;
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
                    _b.sent();
                    if (!(0, utils_1.isImageFile)(filename)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, sharp_1.default)(file.buffer)
                            .resize(constants_1.MESSAGE_FILE_WIDTH, constants_1.MESSAGE_FILE_HEIGHT)
                            .webp()
                            .toFile(absFilePath)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.writeFile(absFilePath, file.buffer)];
                case 5:
                    _b.sent();
                    _b.label = 6;
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
                    return [2 /*return*/, newMessage];
            }
        });
    });
};
var updateMessage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, message, owner, updatedMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.groupId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id, group id and room id');
                    }
                    if (!arg.content || !arg.messageId) {
                        throw new types_1.ValidationError('Require message id and message content');
                    }
                    return [4 /*yield*/, db_1.db.message.findUnique({
                            where: { id: arg.messageId },
                        })];
                case 1:
                    message = _a.sent();
                    if (!message) {
                        throw new types_1.ValidationError("Message ".concat(arg.messageId, " not found"));
                    }
                    return [4 /*yield*/, db_1.db.member.findUnique({
                            where: { id: message.memberId },
                        })];
                case 2:
                    owner = _a.sent();
                    if (!owner) {
                        throw new types_1.ValidationError('The owner of this message was not found');
                    }
                    if (owner.profileId !== origin.profileId) {
                        throw new types_1.ValidationError('Only the author can edit his / her message');
                    }
                    return [4 /*yield*/, db_1.db.message.update({
                            where: {
                                id: arg.messageId,
                            },
                            data: {
                                content: arg.content,
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
                    updatedMessage = _a.sent();
                    return [2 /*return*/, updatedMessage];
            }
        });
    });
};
var deleteMesage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, message, owner, deletedMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.groupId || !origin.roomId) {
                        throw new types_1.ValidationError('Require profile id, group id and room id');
                    }
                    if (!arg.messageId) {
                        throw new types_1.ValidationError('Require message id');
                    }
                    return [4 /*yield*/, db_1.db.message.findUnique({
                            where: { id: arg.messageId },
                        })];
                case 1:
                    message = _a.sent();
                    if (!message) {
                        throw new types_1.ValidationError("Message ".concat(arg.messageId, " not found"));
                    }
                    return [4 /*yield*/, db_1.db.member.findUnique({
                            where: { id: message.memberId },
                        })];
                case 2:
                    owner = _a.sent();
                    if (!owner) {
                        throw new types_1.ValidationError('The owner of this message was not found');
                    }
                    if (owner.profileId !== origin.profileId) {
                        throw new types_1.ValidationError('Only the author can delete his / her message');
                    }
                    return [4 /*yield*/, db_1.db.message.update({
                            where: {
                                id: arg.messageId,
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
                    deletedMessage = _a.sent();
                    return [2 /*return*/, deletedMessage];
            }
        });
    });
};
var createDirectMessage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, conversation, currentMember, newDirectMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.conversationId || !origin.roomId) {
                        throw new types_1.ValidationError('Require conversation id, group id and room id');
                    }
                    if (!arg.content) {
                        throw new types_1.ValidationError('Require message content');
                    }
                    return [4 /*yield*/, db_1.db.conversation.findFirst({
                            where: {
                                id: origin.conversationId,
                                OR: [
                                    {
                                        memberOne: {
                                            profileId: origin.profileId,
                                        },
                                    },
                                    {
                                        memberTwo: {
                                            profileId: origin.profileId,
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
                    conversation = _a.sent();
                    if (!conversation) {
                        throw new types_1.ValidationError('Conversation not exist');
                    }
                    if (conversation.memberOne.profileId === origin.profileId) {
                        currentMember = conversation.memberOne;
                    }
                    if (conversation.memberTwo.profileId === origin.profileId) {
                        currentMember = conversation.memberTwo;
                    }
                    if (!currentMember) {
                        throw new types_1.ValidationError('Can not create message. You are not member of this conversation');
                    }
                    newDirectMessage = db_1.db.directMessage.create({
                        data: {
                            content: arg.content,
                            fileUrl: null,
                            memberId: currentMember.id,
                            conversationId: origin.conversationId,
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    });
                    return [2 /*return*/, newDirectMessage];
            }
        });
    });
};
var uploadDirectMessageFile = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, file, conversation, currentMember, relFolderPath, absFolderPath, filename, relFilePath, absFilePath, newDirectMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], file = args[1];
                    if (!origin.profileId || !origin.conversationId || !origin.roomId) {
                        throw new types_1.ValidationError('Require conversation id, group id and room id');
                    }
                    if (file.filesize > (0, utils_1.convertMbToBytes)(constants_1.IMAGE_SIZE_LIMIT_IN_MB)) {
                        throw new types_1.ValidationError('File size not over 5 MB');
                    }
                    return [4 /*yield*/, db_1.db.conversation.findFirst({
                            where: {
                                id: origin.conversationId,
                                OR: [
                                    {
                                        memberOne: {
                                            profileId: origin.profileId,
                                        },
                                    },
                                    {
                                        memberTwo: {
                                            profileId: origin.profileId,
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
                    conversation = _a.sent();
                    if (!conversation) {
                        throw new types_1.ValidationError('Conversation not exist');
                    }
                    if (conversation.memberOne.profileId === origin.profileId) {
                        currentMember = conversation.memberOne;
                    }
                    if (conversation.memberTwo.profileId === origin.profileId) {
                        currentMember = conversation.memberTwo;
                    }
                    if (!currentMember) {
                        throw new types_1.ValidationError('Can not create message. You are not member of this conversation');
                    }
                    relFolderPath = "/public/conversations/".concat(origin.conversationId);
                    absFolderPath = path_1.default.join(__dirname, '..', relFolderPath);
                    filename = file.filename;
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
                    _a.sent();
                    if (!(0, utils_1.isImageFile)(filename)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, sharp_1.default)(file.buffer)
                            .resize(constants_1.MESSAGE_FILE_WIDTH, constants_1.MESSAGE_FILE_HEIGHT)
                            .webp()
                            .toFile(absFilePath)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.writeFile(absFilePath, file.buffer)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    newDirectMessage = db_1.db.directMessage.create({
                        data: {
                            content: 'This message is a file',
                            fileUrl: relFilePath,
                            memberId: currentMember.id,
                            conversationId: origin.conversationId,
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    });
                    return [2 /*return*/, newDirectMessage];
            }
        });
    });
};
var updateDirectMessage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, directMessageId, directMessage, owner, updatedDirectMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.conversationId || !origin.roomId) {
                        throw new types_1.ValidationError('Require conversation id, group id and room id');
                    }
                    directMessageId = arg.messageId;
                    if (!arg.content || !directMessageId) {
                        throw new types_1.ValidationError('Require direct message id and message content');
                    }
                    return [4 /*yield*/, db_1.db.directMessage.findUnique({
                            where: { id: directMessageId },
                        })];
                case 1:
                    directMessage = _a.sent();
                    if (!directMessage) {
                        throw new types_1.ValidationError("Direct message ".concat(directMessageId, " not found"));
                    }
                    return [4 /*yield*/, db_1.db.member.findUnique({
                            where: { id: directMessage.memberId },
                        })];
                case 2:
                    owner = _a.sent();
                    if (!owner) {
                        throw new types_1.ValidationError('The owner of this message was not found');
                    }
                    if (owner.profileId !== origin.profileId) {
                        throw new types_1.ValidationError('Only the author can edit his / her direct message');
                    }
                    return [4 /*yield*/, db_1.db.directMessage.update({
                            where: {
                                id: directMessageId,
                            },
                            data: {
                                content: arg.content,
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
                    updatedDirectMessage = _a.sent();
                    return [2 /*return*/, updatedDirectMessage];
            }
        });
    });
};
var deleteDirectMesage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var origin, arg, directMessageId, directMessage, owner, deletedDirectMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    origin = args[0], arg = args[1];
                    if (!origin.profileId || !origin.conversationId || !origin.roomId) {
                        throw new types_1.ValidationError('Require conversation id, group id and room id');
                    }
                    directMessageId = arg.messageId;
                    if (!directMessageId) {
                        throw new types_1.ValidationError('Require direct message id');
                    }
                    return [4 /*yield*/, db_1.db.directMessage.findUnique({
                            where: { id: directMessageId },
                        })];
                case 1:
                    directMessage = _a.sent();
                    if (!directMessage) {
                        throw new types_1.ValidationError("Direct message ".concat(directMessageId, " not found"));
                    }
                    return [4 /*yield*/, db_1.db.member.findUnique({
                            where: { id: directMessage.memberId },
                        })];
                case 2:
                    owner = _a.sent();
                    if (!owner) {
                        throw new types_1.ValidationError('The owner of this message was not found');
                    }
                    if (owner.profileId !== origin.profileId) {
                        throw new types_1.ValidationError('Only the author can edit his / her direct message');
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
                    deletedDirectMessage = _a.sent();
                    return [2 /*return*/, deletedDirectMessage];
            }
        });
    });
};
