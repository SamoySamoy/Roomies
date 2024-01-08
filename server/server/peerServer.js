"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPeerServer = void 0;
var peer_1 = require("peer");
var config_1 = require("./lib/config");
var setupPeerServer = function (httpServer) {
    var peerServer = (0, peer_1.ExpressPeerServer)(httpServer, {
        path: '/',
        corsOptions: config_1.corsOptions,
    });
    peerServer.on('connection', function (client) { });
    peerServer.on('disconnect', function (client) { });
    return peerServer;
};
exports.setupPeerServer = setupPeerServer;
