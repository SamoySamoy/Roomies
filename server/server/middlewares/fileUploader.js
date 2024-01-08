"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var utils_1 = require("../lib/utils");
var constants_1 = require("../lib/constants");
var fileUploader = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: function (req, file, callback) {
        if (file.mimetype.split('/')[0] !== 'image') {
            return callback(null, false);
        }
        return callback(null, true);
    },
    limits: {
        fileSize: (0, utils_1.convertMbToBytes)(constants_1.IMAGE_SIZE_LIMIT_IN_MB),
    },
});
exports.default = fileUploader;
