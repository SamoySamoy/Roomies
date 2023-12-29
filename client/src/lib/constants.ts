export const SERVER_PORT_DEV = 8000;
export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}`
    : `${window.location.protocol}//${window.location.hostname}:${SERVER_PORT_DEV}`;
export const SERVER_API_PATH = '/api';
export const SERVER_API_URL = `${SERVER_URL}${SERVER_API_PATH}`;
export const SERVER_SOCKET_API_PATH = `/api/socket`;
export const SERVER_SOCKET_API_URL = `${SERVER_URL}${SERVER_SOCKET_API_PATH}`;
