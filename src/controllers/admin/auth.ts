import { Router } from 'express';
import { updateAdmin } from '~/services/admin/admin';
import { adminLogin, adminRegister } from '~/services/admin/auth';

const adminAuthRouter = Router();

adminAuthRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const token = await adminRegister(email, password);
  res.status(201).json(token);
});

adminAuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = await adminLogin(email, password);
  res.status(200).json(token);
});

adminAuthRouter.patch('/password', async (req, res) => {
  const { email, password } = req.body;
  await updateAdmin(email, password);
  res.status(200).json();
});

export default adminAuthRouter;
