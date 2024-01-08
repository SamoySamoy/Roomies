export const SERVER_PORT_DEV = 8000 as const;
export const SERVER_PORT_LOCAL = 5173 as const;
export const SERVER_PORT_DEPLOY = 5173 as const;
/* export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}`
    : (`${window.location.protocol}//${window.location.hostname}:${SERVER_PORT_DEV}` as const); */
export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? (`${window.location.protocol}//${window.location.hostname}:${SERVER_PORT_LOCAL}` as const)
    : (`${window.location.protocol}//${window.location.hostname}:${SERVER_PORT_DEV}` as const);
export const SERVER_API_PATH = '/api' as const;
export const SERVER_API_URL = `${SERVER_URL}${SERVER_API_PATH}` as const;
export const SERVER_SOCKET_API_PATH = `/api/socket` as const;
export const SERVER_SOCKET_API_URL = `${SERVER_URL}${SERVER_SOCKET_API_PATH}` as const;

export const IMAGE_EXT_LIST = [
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
export const IMAGE_SIZE_LIMIT_IN_MB = 5;

export const REAL_AVATAR_WIDTH = 300;
export const REAL_AVATAR_HEIGHT = 300;
export const REAL_MESSAGE_FILE_WIDTH = 1000;
export const REAL_MESSAGE_FILE_HEIGHT = 600;
export const CLIENT_AVATAR_WIDTH = 48;
export const CLIENT_AVATAR_HEIGHT = 48;
export const CLIENT_MESSAGE_FILE_WIDTH = 350;
export const CLIENT_MESSAGE_FILE_HEIGHT = 200;
