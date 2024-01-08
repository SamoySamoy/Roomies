"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_FILE_HEIGHT = exports.MESSAGE_FILE_WIDTH = exports.AVATAR_HEIGHT = exports.AVATAR_WIDTH = exports.CLIENT_LOCATION = exports.ALLOWED_ORIGIN = exports.MESSAGES_BATCH = exports.IMAGE_EXT_LIST = exports.IMAGE_SIZE_LIMIT_IN_MB = exports.TRUTHY = void 0;
exports.TRUTHY = [1, true, '1', 'true'];
exports.IMAGE_SIZE_LIMIT_IN_MB = 5;
exports.IMAGE_EXT_LIST = [
    'avif',
    'bmp',
    'jpeg',
    'png',
    'tiff',
    'webp',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'webp',
    'svg',
    'ico',
    'jfif',
    'pjpeg',
    'pjp',
    'apng',
    'avif',
    'cur',
    'dds',
    'jbig',
    'jp2',
    'jpeg2000',
    'jpm',
    'jpx',
    'pbm',
    'pgm',
    'ppm',
    'pnm',
    'pam',
    'exr',
    'hdr',
    'pic',
    'tga',
    'xbm',
    'xpm',
    'yuv',
    'rgb',
    'rgba',
    'bw',
    'rgba',
    'sgi',
    'int',
    'inta',
    'icb',
    'vda',
    'vst',
    'targa',
    'icns',
    'texture',
    'thumb',
    'info',
    'b16',
    'gen',
    'tex',
    'scn',
    'hdr',
    'xwd',
    'jif',
    'jfi',
];
exports.MESSAGES_BATCH = 15;
exports.ALLOWED_ORIGIN = [
    undefined,
    'http://localhost:5173',
    'http://localhost:8000',
    'http://fall2324w3g13.int3306.freeddns.org',
];
exports.CLIENT_LOCATION = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'http://fall2324w3g13.int3306.freeddns.org';
exports.AVATAR_WIDTH = 300;
exports.AVATAR_HEIGHT = 300;
exports.MESSAGE_FILE_WIDTH = 1000;
exports.MESSAGE_FILE_HEIGHT = 600;
