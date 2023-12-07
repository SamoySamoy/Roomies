import { Request } from 'express';

const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();

export default getIp;

