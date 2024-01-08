"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.peerServer = exports.PORT = void 0;
var dotenv = __importStar(require("dotenv"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var peer_1 = require("peer");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var http_1 = require("http");
var routes_1 = __importDefault(require("./routes"));
var ws_1 = require("./ws");
var config_1 = require("./lib/config");
var logger_1 = require("./middlewares/logger");
dotenv.config();
exports.PORT = Number((process.env.NODE_ENV === 'development' ? process.env.PORT_DEV : process.env.PORT_LOCAL) || 8000);
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
exports.peerServer = (0, peer_1.PeerServer)({
    port: exports.PORT + 1,
    path: '/',
    corsOptions: config_1.corsOptions,
});
// const peerServer = setupPeerServer(httpServer);
var io = (0, ws_1.setupWs)(httpServer);
app.use((0, cors_1.default)(config_1.corsOptions));
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   }),
// );
app.use((0, logger_1.logger)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use('/peer', peerServer);
app.use('/api/public', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/api', routes_1.default);
if (process.env.NODE_ENV === 'development') {
    app.get('/*', function (req, res) {
        return res.status(200).json({
            message: 'Hello World',
        });
    });
    app.get('*', function (req, res) {
        return res.status(404).json({
            message: 'Not found',
        });
    });
}
else {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client')));
    app.get('/*', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, '..', 'client', 'index.html'));
    });
}
httpServer.listen(exports.PORT, function () {
    console.log("App is running on port ".concat(exports.PORT));
});
