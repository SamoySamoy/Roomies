"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var members_1 = require("../controllers/members");
var members = (0, express_1.Router)();
members.get('/', members_1.getMembers);
members.put('/:memberId', members_1.updateMember);
members.delete('/:memberId', members_1.deleteMember);
exports.default = members;
