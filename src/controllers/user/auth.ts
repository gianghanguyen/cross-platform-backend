import { Request, Response, Router } from 'express';
import { logIn, register, logout, refreshToken, verifyEmail, changePassword } from '../../services/user/auth'; // Thêm verifyEmail vào import
import 'express-async-errors';
import httpStatus from 'http-status';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';

const userAuthRouter = Router();

userAuthRouter.post('/login', async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;
  const token = await logIn({ email, password });
  res.json(token);
});

userAuthRouter.post('/register', async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;
  const token = await register({ email, password });
  res.json(token);
});

userAuthRouter.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await logout(refreshToken);
  res.status(httpStatus.OK).json();
});

userAuthRouter.post('/refresh-token', async (req: Request, res: Response) => {
  res.json(await refreshToken(req.body.refreshToken));
});

userAuthRouter.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;
  res.json(await verifyEmail(token as string));
});

userAuthRouter.put('/change-password', tokenExtractor('USER'), async (req: CustomRequest, res: Response) => {
  res.json(await changePassword(req.user!.id, req.body.password, req.body.newPassword));
});

export default userAuthRouter;
