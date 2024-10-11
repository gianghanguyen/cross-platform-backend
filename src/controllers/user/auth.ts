import { Request, Response, Router } from 'express';
import { logIn, register, logout, refreshToken } from '../../services/user/auth';
import 'express-async-errors';
import httpStatus from 'http-status-codes';
import { authValidation } from '~/validations/auth';

const authRouter = Router();

authRouter.post('/login', authValidation.auth, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await logIn({ email, password });
  res.status(httpStatus.OK).json(token);
});

authRouter.post('/register', authValidation.auth, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await register({ email, password });
  res.status(httpStatus.CREATED).json(token);
});

authRouter.post('/logout', authValidation.refreshToken, async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await logout(refreshToken);
  res.status(httpStatus.OK).json();
});

authRouter.post('/refresh-token', authValidation.auth, async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json(await refreshToken(req.body.refreshToken));
});

export default authRouter;
