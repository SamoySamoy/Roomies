import axios from 'axios';
import { Socket, io } from 'socket.io-client';

export const SERVER_PORT_DEV = 8000;
export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}`
    : `${window.location.protocol}//${window.location.hostname}:${SERVER_PORT_DEV}`;
export const SERVER_API_PATH = '/api';
export const SERVER_API_URL = `${SERVER_URL}${SERVER_API_PATH}`;
export const SERVER_SOCKET_API_PATH = `/api/socket`;
export const SERVER_SOCKET_API_URL = `${SERVER_URL}${SERVER_SOCKET_API_PATH}`;

export const api = axios.create({
  baseURL: SERVER_API_URL,
  withCredentials: true,
});
// Intercept the request before it really sent
api.interceptors.request.use(reqConfig => {
  if (!reqConfig.headers.getAuthorization()) {
    reqConfig.headers.setAuthorization('Bearer');
  }
  return reqConfig;
});

type ServerToClientEvents = {
  'chat:broadcast:message': (msg: string) => void;
};
type ClientToServerEvents = {
  'chat:send:message': (content: string) => void;
};

export type SocketApi = Socket<ServerToClientEvents, ClientToServerEvents>;

export const getSocketApi = () =>
  io(SERVER_URL, {
    path: SERVER_SOCKET_API_PATH,
    addTrailingSlash: false,
  }) as SocketApi;
