import { Router } from 'express';
import { deactivateUser } from '~/services/admin/user';
import { tokenExtractor } from '~/middlewares/auth';
import httpStatus from 'http-status';

const adminUserRouter = Router();
adminUserRouter.use(tokenExtractor('ADMIN'));

adminUserRouter.patch('/deactivate', async (req, res) => {
  const { id } = req.body;
  await deactivateUser({ id });
  res.status(httpStatus.OK).json();
});

export default adminUserRouter;
