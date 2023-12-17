import * as dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users';
import serversRouter from './routes/servers';
import channelsRouter from './routes/channels';
import { setupWs } from './ws';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);
setupWs(httpServer);

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello World',
  });
});

app.use(usersRouter);
app.use(serversRouter);
app.use(channelsRouter);

app.get('*', (req, res) => {
  return res.status(200).json({
    message: 'Not found',
  });
});

httpServer.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
