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

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);
setupWs(httpServer);

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);

app.use('/api/public', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello World',
  });
});

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    message: 'Not found',
  });
});

httpServer.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
