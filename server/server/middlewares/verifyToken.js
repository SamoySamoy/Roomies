"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../lib/utils");
var verifyToken = function (req, res, next) {
    var authHeader = req.headers.authorization || req.headers['Authorization'];
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.sendStatus(401);
    }
    var token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json();
    }
    var decoded = (0, utils_1.decodeToken)({
        type: 'accessToken',
        token: token,
    });
    if (!decoded) {
        return res.status(403).json((0, utils_1.createMsg)({
            type: 'invalid',
            invalidMessage: 'Forbidden - Invalid token',
        }));
    }
    req.user = decoded;
    next();
};
exports.default = verifyToken;
