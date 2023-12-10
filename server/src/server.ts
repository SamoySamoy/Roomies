import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import usersRouter from "./routes/users";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

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

app.get('*', (req, res) => {
  return res.status(200).json({
    message: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});


