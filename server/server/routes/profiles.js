"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var profiles_1 = require("../controllers/profiles");
var fileUploader_1 = __importDefault(require("../middlewares/fileUploader"));
var profilesRouter = (0, express_1.Router)();
profilesRouter.get('/:profileId', profiles_1.getProfileByProfileId);
profilesRouter.put('/changePassword', profiles_1.changePassword);
profilesRouter.put('/image', fileUploader_1.default.single('profileImage'), profiles_1.uploadProfileImage);
profilesRouter.delete('/image', profiles_1.deleteProfileImage);
exports.default = profilesRouter;
