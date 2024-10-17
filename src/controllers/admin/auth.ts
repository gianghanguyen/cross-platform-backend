import { Router } from 'express';
import { updateAdmin } from '~/services/admin/admin';
import { adminLogin, adminRegister } from '~/services/admin/auth';
import 'express-async-errors';
import httpStatus from 'http-status';

const adminAuthRouter = Router();

adminAuthRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const token = await adminRegister(email, password);
  res.status(httpStatus.OK).json(token);
});

adminAuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = await adminLogin(email, password);
  res.status(httpStatus.OK).json(token);
});

adminAuthRouter.patch('/password', async (req, res) => {
  const { email, password } = req.body;
  await updateAdmin(email, password);
  res.status(httpStatus.OK).json();
});

export default adminAuthRouter;
