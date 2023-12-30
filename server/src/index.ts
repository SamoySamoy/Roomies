import * as dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import apiRouter from './routes';
import { setupWs } from './ws';
import { corsOptions } from './lib/config';
import { logger } from './middlewares/logger';
import { setupPeerServer } from './peerServer';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);
const peerServer = setupPeerServer(httpServer);
const io = setupWs(httpServer);

app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(logger());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/peer', peerServer);
app.use('/api/public', express.static(path.join(__dirname, '..', 'public')));

if (process.env.NODE_ENV === 'development') {
  app.get('/*', (req, res) => {
    return res.status(200).json({
      message: 'Hello World',
    });
  });
} else {
  app.use(express.static(path.join(__dirname, '..', 'client')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  });
}

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    message: 'Not found',
  });
});

httpServer.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
