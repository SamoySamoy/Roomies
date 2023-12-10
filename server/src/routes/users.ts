import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

import { registerUser, addIp, checkLogin, getUserData } from '../utils/userOps';
import getIp from '../utils/getIp';

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Handling GET requests to /users...',
  });
});

// register user
router.post('/api/users/register', async (req: Request, res: Response) => {
  const { email, hashedPassword } = req.body;
  const ip = getIp(req);
  const { success, data } = await registerUser(email, hashedPassword, ip);
  res.send({ success, data });
});

// login user
router.post('/api/users/login', async (req: Request, res: Response) => {
  const ip = getIp(req);
  const { email, hashedPassword } = await req.body;
  const data = await checkLogin(email, hashedPassword);
  if (data.success) {
    await addIp(email, ip);
    res.send(data);
  } else {
    res.send({ success: false, status: '412 Precondition Failed' });
  }
});

// get user info by id
router.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await getUserData(id);
    res.send(data);
  } catch {
    res.send({ success: false });
  }
});

export default router;
