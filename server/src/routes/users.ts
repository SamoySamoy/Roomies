import express, { Request, Response, Router } from 'express';

const multer = require('multer'); // for file uploading
const upload = multer({ dest: 'profile_pictures' });

const router: Router = express.Router();

import { registerUser, addIp } from '../utils/userOps';

import getIp from '../utils/getIp';

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Handling GET requests to /users...',
  });
});

// register api
router.post('/api/users/register', async (req: Request, res: Response) => {
  const { email, hashedPassword } = req.body;
  const ip = getIp(req);
  console.log(email, hashedPassword, ip);
  const { success, data } = await registerUser(email, hashedPassword, ip);
  res.send({ success, data });
});

export default router;
