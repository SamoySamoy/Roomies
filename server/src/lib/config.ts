import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (requestOrigin === undefined || requestOrigin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by Cors'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204,
};
