import { Request, Response, Router } from 'express';
import {
  logIn,
  register,
  logout,
  refreshToken,
  verifyEmail,
  changePassword,
  verifyToken,
} from '../../services/user/auth'; // Thêm verifyEmail vào import
import 'express-async-errors';
import httpStatus from 'http-status';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import { authValidation } from '~/validations/auth';

const userAuthRouter = Router();

userAuthRouter.post('/login', authValidation.auth, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await logIn({ email, password });
  res.status(httpStatus.OK).json(token);
});

userAuthRouter.post('/register', authValidation.auth, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await register({ email, password });
  res.status(httpStatus.CREATED).json(token);
});

userAuthRouter.post('/logout', authValidation.refreshToken, async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await logout(refreshToken);
  res.status(httpStatus.OK).json();
});

userAuthRouter.post('/refresh-token', authValidation.auth, async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json(await refreshToken(req.body.refreshToken));
});

userAuthRouter.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;
  res.json(await verifyEmail(token as string));
});

userAuthRouter.put('/change-password', tokenExtractor('USER'), async (req: CustomRequest, res: Response) => {
  res.json(await changePassword(req.user!.id, req.body.password, req.body.newPassword));
});

userAuthRouter.get('/verify-token', async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const payload = verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET || '');
    res.json({ valid: true, payload });
  } catch (error: any) {
    res.status(httpStatus.UNAUTHORIZED).json({ valid: false, error: error.message });
  }
});

export default userAuthRouter;
