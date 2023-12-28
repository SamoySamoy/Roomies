// import { format } from 'date-fns';
// import { v4 as uuid } from 'uuid';
// import { PlainExpressMiddleware } from '@/types/function';

import { NextFunction, Request, Response } from 'express';

// import fs from 'fs';
// const fsPromises = require('fs').promises;
// import path from 'path';

// export const saveLog = async (message: string, fileName: string) => {
//   const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
//   const logItem = `${dateTime}\t${message}\t${uuid()}\n`;

//   try {
//     if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
//       await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
//     }

//     await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem);
//   } catch (err) {
//     // console.log(err);
//   }
// };

export const logger = () => (req: Request, res: Response, next: NextFunction) => {
  // saveLog(`${req.method}\t${req.headers.origin}\t${req.url}`, 'req-logs.txt');
  console.log(`${req.method} ${req.path}`);
  next();
};
