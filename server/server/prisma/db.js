"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var client_1 = require("@prisma/client");
exports.db = globalThis.prisma || new client_1.PrismaClient();
globalThis.prisma = exports.db;
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
